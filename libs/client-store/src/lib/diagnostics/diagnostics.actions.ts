import { actionPayloadConstructor, IActionPayload } from '@upgraded-enigma/client-util';

import { DIAGNOSTICS_STATE_TOKEN, IDiagnosticsState } from './diagnostics.interface';

const createAction = actionPayloadConstructor(DIAGNOSTICS_STATE_TOKEN.getName());

export type TDiagnosticsPayload = IActionPayload<Partial<IDiagnosticsState>>;

export const setState = createAction<TDiagnosticsPayload>('set state');

export const getStaticData = createAction('get static data');
