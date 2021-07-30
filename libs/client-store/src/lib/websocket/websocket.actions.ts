import { actionPayloadConstructor } from '@app/client-util';

import { TWebsocketPayload, WEBSOCKET_STATE_TOKEN } from './websocket.interface';

const createAction = actionPayloadConstructor(WEBSOCKET_STATE_TOKEN.getName());

const setState = createAction<TWebsocketPayload>('set state');

const resetState = createAction<TWebsocketPayload>('reset state');

export const websocketActions = {
  setState,
  resetState,
};
