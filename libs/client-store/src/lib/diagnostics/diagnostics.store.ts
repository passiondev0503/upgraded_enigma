import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { getStaticData, setState, TDiagnosticsPayload } from './diagnostics.actions';
import {
  DIAGNOSTICS_STATE_TOKEN,
  diagnosticsInitialState,
  IDiagnosticsState,
} from './diagnostics.interface';
import { AppServerStaticDataService } from './services/server-static-data-api.service';

export const diagnosticsActions = {
  setState,
  getStaticData,
};

@State<IDiagnosticsState>({
  name: DIAGNOSTICS_STATE_TOKEN,
  defaults: {
    ...diagnosticsInitialState,
  },
})
@Injectable()
export class AppDiagnosticsState {
  constructor(private readonly api: AppServerStaticDataService) {}

  @Selector()
  public static state(state: IDiagnosticsState) {
    return state;
  }

  @Action(diagnosticsActions.setState)
  public setState(ctx: StateContext<IDiagnosticsState>, { payload }: TDiagnosticsPayload) {
    ctx.patchState(payload);
  }

  @Action(diagnosticsActions.getStaticData)
  public getStaticData(ctx: StateContext<IDiagnosticsState>) {
    return this.api.getData().pipe(
      tap(data => {
        void ctx.dispatch(new diagnosticsActions.setState({ static: data }));
      }),
    );
  }
}
