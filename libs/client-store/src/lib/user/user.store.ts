import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { combineLatest } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

import {
  TAddPasswordPayload,
  TConfigureUserPayload,
  TDeletePasswordPayload,
  TLogInPayload,
  TUserPayload,
  userActions,
} from './user.actions';
import { IUserState, USER_STATE_TOKEN, userInitialState } from './user.interface';
import { AppUserApiService } from './user-api.service';

@State<IUserState>({
  name: USER_STATE_TOKEN,
  defaults: {
    ...userInitialState,
  },
})
@Injectable()
export class AppUserState {
  constructor(private readonly api: AppUserApiService) {}

  @Selector()
  public static model(state: IUserState) {
    return state;
  }

  @Selector()
  public static email(state: IUserState) {
    return state.email;
  }

  @Selector()
  public static token(state: IUserState) {
    return state.token;
  }

  @Action(userActions.setState)
  public setState(ctx: StateContext<IUserState>, { payload }: TUserPayload) {
    const currentState: IUserState = ctx.getState();
    const email = typeof payload.email !== 'undefined' ? payload.email : currentState.email;
    const token = typeof payload.token !== 'undefined' ? payload.token : currentState.token;
    const status = typeof payload.status !== 'undefined' ? { ...currentState.status, ...payload.status } : { ...currentState.status };
    const passwords = typeof payload.passwords !== 'undefined' ? [...payload.passwords] : [...currentState.passwords];
    const newState: IUserState = { ...currentState, email, token, passwords, status };
    return ctx.patchState(newState);
  }

  @Action(userActions.logIn)
  public logIn(ctx: StateContext<IUserState>, { payload }: TLogInPayload) {
    return this.api.login({ email: payload.email, password: payload.password }).pipe(
      concatMap(user => this.api.getUserStatus().pipe(map(status => ({ user, status })))),
      map(({ user, status }) => {
        const currentState: IUserState = ctx.getState();
        const newState: IUserState = {
          ...currentState,
          ...user,
          status,
        };
        return ctx.patchState(newState);
      }),
    );
  }

  @Action(userActions.logOut)
  public logOut(ctx: StateContext<IUserState>) {
    const token = ctx.getState().token;
    return this.api.logout({ token }).pipe(
      map(result => {
        return ctx.patchState(userInitialState);
      }),
    );
  }

  @Action(userActions.configureUser)
  public configureUser(ctx: StateContext<IUserState>, { payload }: TConfigureUserPayload) {
    return this.api.configureUser({ ...payload }).pipe(
      map(user => {
        const currentState: IUserState = ctx.getState();
        const email = user.email;
        const token = user.token;
        const status = typeof payload.status !== 'undefined' ? { ...currentState.status, ...payload.status } : { ...currentState.status };
        const passwords = typeof payload.passwords !== 'undefined' ? [...payload.passwords] : [...currentState.passwords];
        const newState: IUserState = { ...currentState, email, token, passwords, status };
        return ctx.patchState(newState);
      }),
    );
  }

  @Action(userActions.getUser)
  public getUser(ctx: StateContext<IUserState>) {
    return combineLatest([this.api.getUser(), this.api.getUserStatus()]).pipe(
      map(([user, userStatus]) => {
        const currentState: IUserState = ctx.getState();
        const nextState: IUserState = {
          ...currentState,
          ...user,
          status: { ...userStatus },
        };
        ctx.patchState(nextState);
        return nextState;
      }),
    );
  }

  @Action(userActions.listExportedPasswordFiles)
  public listExportedPasswordFiles(ctx: StateContext<IUserState>) {
    return this.api.listExportedPasswordFiles().pipe(
      map(exported => {
        const currentState: IUserState = ctx.getState();
        return ctx.patchState({ ...currentState, exportedPasswordFiles: [...exported] });
      }),
    );
  }

  @Action(userActions.addPassword)
  public addPassword(ctx: StateContext<IUserState>, { payload }: TAddPasswordPayload) {
    return this.api.addPassword(payload).pipe(
      map(exported => {
        const currentState: IUserState = ctx.getState();
        return ctx.patchState({ passwords: [...currentState.passwords, payload] });
      }),
    );
  }

  @Action(userActions.deletePassword)
  public deletePassword(ctx: StateContext<IUserState>, { payload }: TDeletePasswordPayload) {
    return this.api.deletePassword(payload).pipe(
      map(user => {
        return ctx.patchState({
          passwords: [...user.passwords],
        });
      }),
    );
  }

  @Action(userActions.encryptPasswords)
  public encryptPasswords(ctx: StateContext<IUserState>) {
    return this.api.encryptPasswords();
  }

  @Action(userActions.decryptPasswords)
  public decryptPasswords(ctx: StateContext<IUserState>) {
    return this.api.decryptPasswords();
  }

  @Action(userActions.exportPasswords)
  public exportPasswords(ctx: StateContext<IUserState>) {
    return this.api.exportPasswords();
  }

  @Action(userActions.generateKeypair)
  public generateKeypair(ctx: StateContext<IUserState>) {
    return this.api.generateKeypair();
  }
}
