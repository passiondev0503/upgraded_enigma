import { createAction, props } from '@ngrx/store';

import { featureName, TDiagnosticsDataResponse } from './diagnostics.interface';

const type = (name: string) => `[${featureName}] ${name}`;

const staticData = createAction(type('static data'));

const staticDataSuccess = createAction(type('static data success'), props<{ payload: TDiagnosticsDataResponse }>());
const dynamicDataSuccess = createAction(type('dynamic data success'), props<{ payload: TDiagnosticsDataResponse }>());

export const diagnosticsActions = {
  staticData,
  staticDataSuccess,
  dynamicDataSuccess,
};
