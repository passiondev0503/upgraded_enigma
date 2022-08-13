import { createSelector } from '@ngrx/store';

import { IDiagnosticsState, IDiagnosticsStateModel } from './diagnostics.interface';

const selectFeature = (state: IDiagnosticsState) => state.diagnostics;

const staticData = createSelector(selectFeature, (state: IDiagnosticsStateModel) => state.staticData);
const dynamicData = createSelector(selectFeature, (state: IDiagnosticsStateModel) => state.dynamicData);
const allData = createSelector(selectFeature, (state: IDiagnosticsStateModel) => state);

export const diagnosticsSelectors = {
  allData,
  staticData,
  dynamicData,
};
