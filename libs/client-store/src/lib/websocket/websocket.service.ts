import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { diagnosticsActions } from '../diagnostics/diagnostics.store';
import { IAppWebsocketStatePayload } from './websocket.interface';
import { websocketActions } from './websocket.store';
import { AppWebsocketApiService } from './websocket-api.service';

/**
 * @note TODO: refactor, inject service in the store feature module instead of injecting store in the service.
 */
@Injectable({
  providedIn: 'root',
})
export class AppWebsocketService {
  constructor(private readonly store: Store, protected api: AppWebsocketApiService) {
    void this.api
      .connect()
      .pipe(
        concatMap(event => {
          if (event.event === 'dynamic') {
            const payload = {
              dynamic: event.data as Record<string, string | number>[],
            };
            void this.store.dispatch(new diagnosticsActions.setState(payload));
          }
          if (event.event === 'users') {
            const payload = {
              users: event.event === 'users' ? (event.data as number) : void 0,
              events: [event],
            };
            void this.setState(payload);
          }
          return of(null);
        }),
      )
      .subscribe();
  }

  public setState(payload: IAppWebsocketStatePayload): Observable<IAppWebsocketStatePayload> {
    return this.store.dispatch(new websocketActions.setState(payload));
  }

  public getDynamicDiagnosticData() {
    this.api.sendEvent('get-diag-dynamic');
  }

  public stopDynamicDiagnosticData() {
    this.api.sendEvent('stop-diag-dynamic');
  }
}
