import { Injectable, InjectionToken, Provider } from '@angular/core';
import { ActionReducer, createReducer, on } from '@ngrx/store';

import { userActions } from './user.actions';
import { featureName, IUserStateModel } from './user.interface';

@Injectable({
  providedIn: 'root',
})
export class AppUserReducer {
  public static readonly initialState: IUserStateModel = {
    email: void 0,
    token: void 0,
    passwords: [],
    status: {
      initialized: false,
      encryption: false,
      encrypted: false,
    },
    exportedPasswordFiles: [],
  };

  public static readonly token = new InjectionToken<ActionReducer<IUserStateModel>>(`${featureName} reducer`);

  public static readonly provider: Provider = {
    provide: AppUserReducer.token,
    deps: [AppUserReducer],
    useFactory: (reducer: AppUserReducer) => reducer.createReducer(),
  };

  public createReducer() {
    return createReducer(
      AppUserReducer.initialState,
      on(userActions.login, (state, { payload }) => ({ ...state, email: payload.email })),
      on(userActions.setState, (state, { payload }) => ({ ...state, ...payload })),
      on(userActions.resetState, state => ({ ...AppUserReducer.initialState, email: state.email })),
    );
  }
}
