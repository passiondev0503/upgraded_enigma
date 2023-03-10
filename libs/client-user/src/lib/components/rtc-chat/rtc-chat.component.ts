import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NAVIGATOR } from '@app/client-util';
import { BehaviorSubject, combineLatest, from, Observable, of } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';

const getSenderId = () => {
  const multiplier = 1000000000;
  return Math.floor(Math.random() * multiplier);
};

interface IRtcPeerDto {
  sender: number;
  type: 'offer' | 'answer';
  sdp: string | null;
}

interface IRtcPeer {
  sender: number;
  type: 'offer' | 'answer';
  sdp: RTCSessionDescription | null;
}

interface IFirestoreRoom<T1 = IRtcPeerDto, T2 = string> {
  name: string;
  peers: T1[];
  ice?: T2[];
}

type TFirestoreRooms = IFirestoreRoom[];

@Component({
  selector: 'app-rtc-chat',
  templateUrl: './rtc-chat.component.html',
  styleUrls: ['./rtc-chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppUserRtcChatComponent implements OnInit {
  private readonly mediaDevicesSubject = new BehaviorSubject<MediaDeviceInfo[]>([]);

  public readonly mediaDevices$ = this.mediaDevicesSubject.asObservable();

  public readonly webRtcConfig: {
    servers: {
      iceServers: [{ urls: string[] }];
      iceCandidatePoolSize: number;
    };
    roomId: string;
    senderId: number;
  } = {
    servers: {
      iceServers: [
        {
          urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
      ],
      iceCandidatePoolSize: 10,
    },
    roomId: 'T1vgzF95VyHhCewCbWG6',
    senderId: getSenderId(), // TODO: this should be firebase user id (app should require firebase auth after local)
  };

  private readonly roomRef$ = from(this.firestore.collection<TFirestoreRooms>('rooms').doc<IFirestoreRoom>(this.webRtcConfig.roomId).get());

  private readonly iceCandidatesSubject = new BehaviorSubject<RTCIceCandidate[]>([]);

  public readonly iceCandidates$ = this.iceCandidatesSubject.asObservable();

  private readonly peerConnection = new RTCPeerConnection(this.webRtcConfig.servers);

  private readonly localVideoStreamSubject = new BehaviorSubject<MediaStream>(new MediaStream());

  public readonly localVideoStream$ = this.localVideoStreamSubject.asObservable();

  private readonly remoteVideoStreamSubject = new BehaviorSubject<MediaStream>(new MediaStream());

  public readonly remoteVideoStream$ = this.remoteVideoStreamSubject.asObservable();

  private readonly videoRoomPeersSubject = new BehaviorSubject<IRtcPeer[]>([]);

  public readonly videoRoomPeers$ = this.videoRoomPeersSubject.asObservable();

  public readonly offers$ = this.videoRoomPeers$.pipe(
    map(peers => peers.filter(item => item.type === 'offer' && item.sender !== this.webRtcConfig.senderId)),
  );

  public readonly videoRoomPeersValueChanges = this.firestore
    .collection<TFirestoreRooms>('rooms')
    .doc<IFirestoreRoom>(this.webRtcConfig.roomId)
    .valueChanges()
    .pipe(
      filter(room => typeof room !== 'undefined'),
      map(room => {
        // eslint-disable-next-line no-console -- TODO: remove after debugging
        console.warn('videoRoomPeersValueChanges', room);
        const peers = room?.peers
          .filter(peer => Boolean(peer.sdp))
          .map(peer => {
            const sdp = peer.sdp !== null ? (JSON.parse(peer.sdp) as RTCSessionDescription | null) : null;
            const processed: IRtcPeer = { ...peer, sdp };
            return processed;
          }) as IRtcPeer[];
        this.videoRoomPeersSubject.next(peers);

        if (typeof room?.ice !== 'undefined') {
          const ice = room.ice.map(item => new RTCIceCandidate(JSON.parse(item)));
          this.iceCandidatesSubject.next(ice);
        }

        const answer = room?.peers.find(item => item.type === 'answer' && item.sender !== this.webRtcConfig.senderId);
        if (typeof answer !== 'undefined' && answer.sdp !== null) {
          const andwerSdp = JSON.parse(answer.sdp) as RTCSessionDescriptionInit;
          void this.receiveVideoRoomAnswer(andwerSdp).subscribe();
        }

        return peers;
      }),
    );

  constructor(private readonly firestore: AngularFirestore, @Inject(NAVIGATOR) private readonly nav: Navigator) {}

  /**
   * Creates video call offer.
   */
  public createOffer() {
    void this.roomRef$
      .pipe(
        filter(roomSnapshot => roomSnapshot.exists),
        first(),
        switchMap(roomSnapshot => {
          // eslint-disable-next-line no-console -- TODO: remove after debugging
          console.warn('Got room:', roomSnapshot);

          return this.sendVideoRoomOffer(roomSnapshot);
        }),
      )
      .subscribe();
  }

  /**
   * Accepts video call offer.
   *
   * @param peer RTC peer
   */
  public acceptOffer(peer: IRtcPeer) {
    const descriptionInitDict: RTCSessionDescriptionInit = peer.sdp ?? {
      sdp: void 0,
      type: 'offer',
    };
    void from(this.peerConnection.setRemoteDescription(new RTCSessionDescription(descriptionInitDict)))
      .pipe(
        switchMap(() => {
          const observables: Observable<void>[] = [];
          for (const candidate of this.iceCandidatesSubject.value) {
            observables.push(from(this.peerConnection.addIceCandidate(candidate)));
          }
          return combineLatest(observables);
        }),
        switchMap(() => from(this.peerConnection.createAnswer())),
        switchMap(answer => {
          // eslint-disable-next-line no-console -- TODO: remove after debugging
          console.warn('answer', answer);
          return from(this.peerConnection.setLocalDescription(answer)).pipe(map(() => answer));
        }),
        switchMap(answer => this.sendVideoRoomAnswer(answer)),
      )
      .subscribe();
  }

  /**
   * Maps video room peers.
   * @param peers video room peers
   */
  private videoRoomPeersMapper(peers: IRtcPeer[]) {
    const existingPeers = [...(peers.length < 1 ? [] : peers)]
      .filter(peer => !(peer.type === 'offer' && peer.sender === this.webRtcConfig.senderId))
      .map(peer => {
        const sdp = peer.sdp !== null ? JSON.stringify(peer.sdp) : null;
        const processed: IRtcPeerDto = { ...peer, sdp };
        return processed;
      });
    // eslint-disable-next-line no-console -- TODO: remove after debugging
    console.warn('sendVideoRoomOffer: existingPeers', existingPeers);

    const offerExists =
      typeof existingPeers.find(item => item.type === 'offer' && item.sender === this.webRtcConfig.senderId) !== 'undefined';
    // eslint-disable-next-line no-console -- TODO: remove after debugging
    console.warn('sendVideoRoomOffer: offerExists', offerExists);

    return { peers, existingPeers, offerExists };
  }

  /**
   * Sends video room connection offer.
   * @param room room snapshot
   */
  private sendVideoRoomOffer(room: firebase.default.firestore.DocumentSnapshot) {
    // eslint-disable-next-line no-console -- TODO: remove after debugging
    console.warn('sendVideoRoomOffer: room:', room);
    return this.videoRoomPeers$.pipe(
      first(),
      map(peers => this.videoRoomPeersMapper(peers)),
      switchMap(({ peers, existingPeers, offerExists }) =>
        from(
          this.peerConnection.createOffer().then(
            offer => this.peerConnection.setLocalDescription(offer),
            error => {
              // eslint-disable-next-line no-console -- TODO: remove after debugging
              console.error('Peer connection: Error creating offer', error);
            },
          ),
        ).pipe(map(() => ({ peers, existingPeers, offerExists }))),
      ),
      switchMap(({ peers, existingPeers, offerExists }) => {
        // eslint-disable-next-line no-console -- TODO: remove after debugging
        console.warn('sendVideoRoomOffer: peers', peers);
        return offerExists
          ? of(null)
          : from(
              this.firestore
                .collection<TFirestoreRooms>('rooms')
                .doc<IFirestoreRoom>(this.webRtcConfig.roomId)
                .update({
                  peers: [
                    ...existingPeers,
                    {
                      sender: this.webRtcConfig.senderId,
                      type: 'offer',
                      sdp: this.peerConnection.localDescription !== null ? JSON.stringify(this.peerConnection.localDescription) : null,
                    },
                  ],
                })
                .then(
                  result => result,
                  error => {
                    // eslint-disable-next-line no-console -- TODO: remove after debugging
                    console.error('sendVideoRoomOffer: error', error);
                  },
                ),
            );
      }),
    );
  }

  /**
   * Sends video room connection answer.
   *
   * @param answer connection answer
   */
  private sendVideoRoomAnswer(answer: RTCSessionDescriptionInit) {
    return this.videoRoomPeers$.pipe(
      first(),
      switchMap(peers => {
        // eslint-disable-next-line no-console -- TODO: remove after debugging
        console.warn('sendVideoRoomAnswer: peers', peers);

        const existingPeers = [...(peers.length < 1 ? [] : peers)]
          .filter(peer => !(peer.type === 'answer' && peer.sender === this.webRtcConfig.senderId))
          .map(peer => {
            const sdp = peer.sdp !== null ? JSON.stringify(peer.sdp) : null;
            const processed: IRtcPeerDto = { ...peer, sdp };
            return processed;
          });
        // eslint-disable-next-line no-console -- TODO: remove after debugging
        console.warn('sendVideoRoomAnswer: existingPeers', existingPeers);

        return from(
          this.firestore
            .collection<TFirestoreRooms>('rooms')
            .doc<IFirestoreRoom>(this.webRtcConfig.roomId)
            .update({
              peers: [
                ...existingPeers,
                {
                  sender: this.webRtcConfig.senderId,
                  type: 'answer',
                  sdp: JSON.stringify(answer),
                },
              ],
            })
            .catch(error => {
              // eslint-disable-next-line no-console -- TODO: remove after debugging
              console.error('sendVideoRoomAnswer: error', error);
            }),
        );
      }),
    );
  }

  public receiveVideoRoomAnswer(answer: RTCSessionDescriptionInit) {
    return from(this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer ?? void 0)));
  }

  /**
   * Sets up local video stream and adds it to the peer connection.
   *
   * @param stream local media stream
   */
  private setupVideoStream(stream: MediaStream) {
    this.localVideoStreamSubject.next(stream);
    this.localVideoStreamSubject.value.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localVideoStreamSubject.value);
    });
  }

  /**
   * Registers peer connection event listeners with respective action handlers.
   */
  // eslint-disable-next-line max-lines-per-function -- TODO: tech debt
  private registerPeerConnectionListeners() {
    this.peerConnection.addEventListener('icegatheringstatechange', event => {
      // eslint-disable-next-line no-console -- TODO: remove after debugging
      console.warn(`ICE gathering state changed: ${this.peerConnection.iceGatheringState}`, event);

      const ice = this.iceCandidatesSubject.value.map(item => JSON.stringify(item));
      switch (this.peerConnection.iceGatheringState) {
        case 'complete':
          void from(
            this.firestore
              .collection<TFirestoreRooms>('rooms')
              .doc<IFirestoreRoom>(this.webRtcConfig.roomId)
              .update({ ice })
              .catch(error => {
                // eslint-disable-next-line no-console -- TODO: remove after debugging
                console.error('registerPeerConnectionListeners: error', error);
              }),
          ).subscribe();
          break;
        default:
          break;
      }
    });

    this.peerConnection.addEventListener('connectionstatechange', event => {
      // eslint-disable-next-line no-console -- TODO: remove after debugging
      console.warn(`Connection state change: ${this.peerConnection.connectionState}`, event);
    });

    this.peerConnection.addEventListener('signalingstatechange', event => {
      // eslint-disable-next-line no-console -- TODO: remove after debugging
      console.warn(`Signaling state change: ${this.peerConnection.signalingState}`, event);
    });

    this.peerConnection.addEventListener('iceconnectionstatechange ', event => {
      // eslint-disable-next-line no-console -- TODO: remove after debugging
      console.warn(`ICE connection state change: ${this.peerConnection.iceConnectionState}`, event);
    });

    this.peerConnection.addEventListener('icecandidate', event => {
      // eslint-disable-next-line no-console -- TODO: remove after debugging
      console.warn(`ICE Candidate: ${this.peerConnection.iceConnectionState}`, event.candidate);
      if (event.candidate !== null) {
        const candidate = new RTCIceCandidate(event.candidate);
        this.iceCandidatesSubject.next([...this.iceCandidatesSubject.value, candidate]);
      }
    });

    this.peerConnection.addEventListener('track', event => {
      // eslint-disable-next-line no-console -- TODO: remove after debugging
      console.warn(`Track, ${this.peerConnection.iceConnectionState}:`, event.streams[0]);
      const remoteStream = this.remoteVideoStreamSubject.value;
      event.streams[0].getTracks().forEach(track => {
        // eslint-disable-next-line no-console -- TODO: remove after debugging
        console.warn('Add a track to the remoteStream:', track);
        remoteStream.addTrack(track);
      });
      this.remoteVideoStreamSubject.next(remoteStream);
    });

    this.peerConnection.addEventListener('datachannel', event => {
      // eslint-disable-next-line no-console -- TODO: remove after debugging
      console.warn(`Datachannel, ${this.peerConnection.iceConnectionState}:`, event);
    });
  }

  /**
   * Gets media devices.
   */
  private getMediaDevices() {
    return new Promise<void>((resolve, reject) => {
      if (typeof this.nav !== 'undefined') {
        this.nav.mediaDevices
          .enumerateDevices()
          .then(devices => {
            const dev = devices.filter(item => item.deviceId !== '');
            for (const item of dev) {
              this.mediaDevicesSubject.next([...this.mediaDevicesSubject.value, item]);
            }
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }
    });
  }

  /**
   * Connects user media.
   */
  private connectUserMedia() {
    return new Promise<void>((resolve, reject) => {
      if (typeof this.nav !== 'undefined' && this.mediaDevicesSubject.value.length) {
        void this.nav.mediaDevices
          .getUserMedia({
            video: { width: { min: 320 }, height: { min: 240 } },
            audio: true,
          })
          .then(stream => {
            this.setupVideoStream(stream);
            this.registerPeerConnectionListeners();
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      }
    });
  }

  public ngOnInit() {
    this.getMediaDevices()
      .then(() => this.connectUserMedia())
      .catch(error => {
        // eslint-disable-next-line no-console -- TODO: replace with a toaster
        console.error('connectMediaDevices:', error);
      });
  }
}
