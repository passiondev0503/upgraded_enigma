import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { BackendDiagnosticsService } from '@upgraded-enigma/backend-diagnostics';
import { defaultWsPort } from '@upgraded-enigma/backend-interfaces';
import { Subscription, timer } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Server } from 'ws';

@WebSocketGateway(defaultWsPort, {
  path: '/api/events',
  transports: ['websocket'],
})
export class BackendEventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  /**
   * Platform-specific server instance.
   */
  @WebSocketServer()
  protected server?: Server;

  private dynamicDataSub?: Subscription;

  constructor(private readonly diagnosticsService: BackendDiagnosticsService) {}

  private sendClientChangeEvent(): void {
    if (typeof this.server !== 'undefined') {
      const clients = this.server.clients.values();
      for (const client of clients) {
        client.send(JSON.stringify({ event: 'users', data: this.server.clients.size }));
      }
    }
  }

  public async handleConnection() {
    this.sendClientChangeEvent();
  }

  public async handleDisconnect() {
    this.sendClientChangeEvent();
  }

  @SubscribeMessage('get-diag-dynamic')
  public getDynamicDiagnosticEvents() {
    if (typeof this.dynamicDataSub === 'undefined') {
      const timeout = 5000;
      this.dynamicDataSub = timer(0, timeout)
        .pipe(
          tap(() => {
            if (typeof this.server !== 'undefined') {
              const clients = this.server.clients.values();
              for (const client of clients) {
                const event: WsResponse<{ name: string; value: string }[]> = {
                  event: 'dynamic',
                  data: this.diagnosticsService.dynamic(),
                };
                client.send(JSON.stringify(event));
              }
            }
          }),
        )
        .subscribe();
    }
  }

  @SubscribeMessage('stop-diag-dynamic')
  public stopDynamicDiagnosticEvents() {
    if (typeof this.dynamicDataSub !== 'undefined') {
      this.dynamicDataSub.unsubscribe();
    }
  }

  @SubscribeMessage('message')
  public handleMessageEvents(data: { sender: string; text: string }) {
    if (typeof this.server !== 'undefined') {
      const clients = this.server.clients.values();
      for (const client of clients) {
        const event: WsResponse<{ sender: string; text: string }> = {
          event: 'message',
          data,
        };
        client.send(JSON.stringify(event));
      }
    }
  }
}
