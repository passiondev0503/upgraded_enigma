import { actionPayloadConstructor, IActionPayload } from '@app/client-util';

import { DIAGNOSTICS_STATE_TOKEN, IDiagnosticsState } from './diagnostics.interface';

const createAction = actionPayloadConstructor(DIAGNOSTICS_STATE_TOKEN.getName());

export type TDiagnosticsPayload = IActionPayload<Partial<IDiagnosticsState>>;

const setState = createAction<TDiagnosticsPayload>('set state');
const getStaticData = createAction('get static data');

export const diagnosticsActions = {
  setState,
  getStaticData,
};
