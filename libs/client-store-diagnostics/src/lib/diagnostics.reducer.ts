import { Injectable, InjectionToken, Provider } from '@angular/core';
import { ActionReducer, createReducer, on } from '@ngrx/store';

import { diagnosticsActions } from './diagnostics.actions';
import { featureName, IDiagnosticsStateModel } from './diagnostics.interface';

@Injectable({
  providedIn: 'root',
})
export class AppDiagnosticsReducer {
  public static readonly initialState: IDiagnosticsStateModel = {
    staticData: [],
    dynamicData: [],
  };

  public static readonly token = new InjectionToken<ActionReducer<IDiagnosticsStateModel>>(`${featureName} reducer`);

  public static readonly provider: Provider = {
    provide: AppDiagnosticsReducer.token,
    deps: [AppDiagnosticsReducer],
    useFactory: (reducer: AppDiagnosticsReducer) => reducer.createReducer(),
  };

  public createReducer() {
    return createReducer(
      AppDiagnosticsReducer.initialState,
      on(diagnosticsActions.staticDataSuccess, (state, { payload }) => ({ staticData: payload, dynamicData: state.dynamicData })),
      on(diagnosticsActions.dynamicDataSuccess, (state, { payload }) => ({ staticData: state.staticData, dynamicData: payload })),
    );
  }
}
