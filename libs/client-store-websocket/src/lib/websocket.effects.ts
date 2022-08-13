import { Injectable } from '@angular/core';
import { diagnosticsActions } from '@app/client-store-diagnostics';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, tap } from 'rxjs/operators';

import { AppWebsocketApiService } from './services/websocket-api.service';
import { websocketActions } from './websocket.actions';
import { IWebsocketResponseEvent, IWebsocketStateModel } from './websocket.interface';

@Injectable({
  providedIn: 'root',
})
export class AppWebsocketEffects {
  public readonly connect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(websocketActions.connect.type),
      mergeMap(() => this.api.connect<unknown>()),
      map(event => {
        if (event.event === 'dynamic') {
          const nextState = (<IWebsocketResponseEvent<Record<string, string | number>[]>>event).data;
          return diagnosticsActions.dynamicDataSuccess({ payload: nextState });
        }
        const nextState: Partial<IWebsocketStateModel> =
          event.event === 'users'
            ? {
                users: (<IWebsocketResponseEvent<number>>event).data,
                events: [event],
              }
            : {
                events: [event],
              };
        return websocketActions.connected({ payload: nextState });
      }),
    ),
  );

  public readonly getEvents$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(websocketActions.getEvents.type),
        tap(() => {
          this.api.sendEvent('events');
        }),
      ),
    { dispatch: false },
  );

  public readonly sendEvent$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(websocketActions.sendEvent),
        tap(({ payload }) => {
          this.api.sendEvent(payload.eventType);
        }),
      ),
    { dispatch: false },
  );

  constructor(private readonly actions$: Actions, private readonly api: AppWebsocketApiService) {}
}
