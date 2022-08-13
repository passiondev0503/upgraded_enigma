import { createAction, props } from '@ngrx/store';

import { featureName, IWebsocketStateModel, TWebsocketEventType } from './websocket.interface';

const type = (name: string) => `[${featureName}] ${name}`;

const connect = createAction(type('connect'));

const connected = createAction(type('connected'), props<{ payload: Partial<IWebsocketStateModel> }>());

const getEvents = createAction(type('get events'));

const sendEvent = createAction(type('send event'), props<{ payload: { eventType: TWebsocketEventType } }>());

export const websocketActions = {
  connect,
  connected,
  getEvents,
  sendEvent,
};
