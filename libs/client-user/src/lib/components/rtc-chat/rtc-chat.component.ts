import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import {
  AppWebsocketState,
  IWebsocketResponseEvent,
  IWsMessageEvent,
} from '@upgraded-enigma/client-store';
import { NAVIGATOR } from '@upgraded-enigma/client-util';
import { BehaviorSubject, combineLatest, from, Observable, of } from 'rxjs';
import { filter, first, map, mapTo, switchMap } from 'rxjs/operators';

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
  private readonly mediaDevices = new BehaviorSubject<MediaDeviceInfo[]>([]);

  public readonly mediaDevices$ = this.mediaDevices.asObservable();

  public readonly messages$ = this.store
    .select(AppWebsocketState.getState)
    .pipe(map(state => state.events as IWebsocketResponseEvent<IWsMessageEvent>[]));

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

  public readonly form = this.fb.group({
    sender: [`user-${this.webRtcConfig.senderId}`, Validators.compose([Validators.required])],
    text: ['', Validators.compose([Validators.required])],
  });

  private readonly roomRef$ = from(
    this.firestore
      .collection<TFirestoreRooms>('rooms')
      .doc<IFirestoreRoom>(this.webRtcConfig.roomId)
      .get(),
  );

  private readonly iceCandidates = new BehaviorSubject<RTCIceCandidate[]>([]);

  public readonly iceCandidates$ = this.iceCandidates.asObservable();

  private readonly peerConnection = new RTCPeerConnection(this.webRtcConfig.servers);

  private readonly localVideoStream = new BehaviorSubject<MediaStream>(new MediaStream());

  public readonly localVideoStream$ = this.localVideoStream.asObservable();

  private readonly remoteVideoStream = new BehaviorSubject<MediaStream>(new MediaStream());

  public readonly remoteVideoStream$ = this.remoteVideoStream.asObservable();

  private readonly videoRoomPeers = new BehaviorSubject<IRtcPeer[]>([]);

  public readonly videoRoomPeers$ = this.videoRoomPeers.asObservable();

  public readonly offers$ = this.videoRoomPeers$.pipe(
    map(peers =>
      peers.filter(item => item.type === 'offer' && item.sender !== this.webRtcConfig.senderId),
    ),
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
            const sdp =
              peer.sdp !== null ? (JSON.parse(peer.sdp) as RTCSessionDescription | null) : null;
            const processed: IRtcPeer = { ...peer, sdp };
            return processed;
          }) as IRtcPeer[];
        this.videoRoomPeers.next(peers);

        if (typeof room?.ice !== 'undefined') {
          const ice = room.ice.map(item => new RTCIceCandidate(JSON.parse(item)));
          this.iceCandidates.next(ice);
        }

        const answer = room?.peers.find(
          item => item.type === 'answer' && item.sender !== this.webRtcConfig.senderId,
        );
        if (typeof answer !== 'undefined' && answer.sdp !== null) {
          const andwerSdp = JSON.parse(answer.sdp) as RTCSessionDescriptionInit;
          void this.receiveVideoRoomAnswer(andwerSdp).subscribe();
        }

        return peers;
      }),
    );

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private readonly firestore: AngularFirestore,
    @Inject(NAVIGATOR) private readonly nav: Navigator,
  ) {}

  /**
   * Sends chat message.
   */
  public sendChatMessage() {
    if (this.form.valid) {
      // this.store.dispatch(new /* TODO */ ).next(this.form.value);
    }
  }

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
    void from(
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(peer.sdp ?? void 0)),
    )
      .pipe(
        switchMap(() => {
          const observables: Observable<void>[] = [];
          for (const candidate of this.iceCandidates.value) {
            observables.push(from(this.peerConnection.addIceCandidate(candidate)));
          }
          return combineLatest(observables);
        }),
        switchMap(() => from(this.peerConnection.createAnswer())),
        switchMap(answer => {
          // eslint-disable-next-line no-console -- TODO: remove after debugging
          console.warn('answer', answer);
          return from(this.peerConnection.setLocalDescription(answer)).pipe(mapTo(answer));
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
      typeof existingPeers.find(
        item => item.type === 'offer' && item.sender === this.webRtcConfig.senderId,
      ) !== 'undefined';
    // eslint-disable-next-line no-console -- TODO: remove after debugging
    console.warn('sendVideoRoomOffer: offerExists', offerExists);

    return { peers, existingPeers, offerExists };
  }

  /**
   * Sends video room connection offer.
   * @param room room snapshot
   */
  // eslint-disable-next-line max-lines-per-function -- TODO: tech debt
  private sendVideoRoomOffer(
    room: firebase.default.firestore.DocumentSnapshot<firebase.default.firestore.DocumentData>,
  ) {
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
        ).pipe(mapTo({ peers, existingPeers, offerExists })),
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
                      sdp:
                        this.peerConnection.localDescription !== null
                          ? JSON.stringify(this.peerConnection.localDescription)
                          : null,
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
    return from(
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer ?? void 0)),
    );
  }

  /**
   * Sets up local video stream and adds it to the peer connection.
   *
   * @param stream local media stream
   */
  private setupVideoStream(stream: MediaStream) {
    this.localVideoStream.next(stream);
    this.localVideoStream.value.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localVideoStream.value);
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

      const ice = this.iceCandidates.value.map(item => JSON.stringify(item));
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
        this.iceCandidates.next([...this.iceCandidates.value, candidate]);
      }
    });

    this.peerConnection.addEventListener('track', event => {
      // eslint-disable-next-line no-console -- TODO: remove after debugging
      console.warn(`Track, ${this.peerConnection.iceConnectionState}:`, event.streams[0]);
      const remoteStream = this.remoteVideoStream.value;
      event.streams[0].getTracks().forEach(track => {
        // eslint-disable-next-line no-console -- TODO: remove after debugging
        console.warn('Add a track to the remoteStream:', track);
        remoteStream.addTrack(track);
      });
      this.remoteVideoStream.next(remoteStream);
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
    if (typeof this.nav !== 'undefined') {
      this.nav.mediaDevices
        .enumerateDevices()
        .then(devices => {
          devices.forEach(item => {
            this.mediaDevices.next([...this.mediaDevices.value, item]);
          });
        })
        .catch(error => {
          // eslint-disable-next-line no-console -- TODO: remove after debugging
          console.error('getMediaDevices:', error);
        });
    }
  }

  /**
   * Connects user media.
   */
  private connectUserMedia() {
    if (typeof this.nav !== 'undefined') {
      this.nav.getUserMedia(
        {
          video: { width: { min: 320 }, height: { min: 240 } },
          audio: true,
        },
        stream => {
          this.setupVideoStream(stream);
          this.registerPeerConnectionListeners();
        },
        error => {
          // eslint-disable-next-line no-console -- TODO: remove after debugging
          console.error('connectMediaDevices:', error);
        },
      );
    }
  }

  public ngOnInit() {
    this.getMediaDevices();

    this.connectUserMedia();
  }
}
