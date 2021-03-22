import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { combineLatest } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';

import {
  addPassword,
  configureUser,
  decryptPasswords,
  deletePassword,
  encryptPasswords,
  exportPasswords,
  generateKeypair,
  getUser,
  listExportedPasswordFiles,
  logIn,
  logOut,
  setState,
  TAddPasswordPayload,
  TConfigureUserPayload,
  TDeletePasswordPayload,
  TLogInPayload,
  TLogOutPayload,
  TUserPayload,
} from './user.actions';
import { IUserState, USER_STATE_TOKEN, userInitialState } from './user.interface';
import { AppUserService } from './user.service';
import { AppUserApiService } from './user-api.service';

export const userActions = {
  setState,
  logIn,
  logOut,
  configureUser,
  getUser,
  listExportedPasswordFiles,
  addPassword,
  deletePassword,
  encryptPasswords,
  decryptPasswords,
  exportPasswords,
  generateKeypair,
};

@State<IUserState>({
  name: USER_STATE_TOKEN,
  defaults: {
    ...userInitialState,
  },
})
@Injectable()
export class AppUserState {
  constructor(
    private readonly store: Store,
    private readonly user: AppUserService,
    private readonly api: AppUserApiService,
  ) {
    const userObj = this.user.restoreUser();
    void this.store.dispatch(new userActions.setState(userObj)).subscribe();
  }

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

  @Action(setState)
  public setState(ctx: StateContext<IUserState>, { payload }: TUserPayload) {
    const currentState: IUserState = ctx.getState();
    const email = typeof payload.email !== 'undefined' ? payload.email : currentState.email;
    const token = typeof payload.token !== 'undefined' ? payload.token : currentState.token;
    const status =
      typeof payload.status !== 'undefined'
        ? { ...currentState.status, ...payload.status }
        : { ...currentState.status };
    const passwords =
      typeof payload.passwords !== 'undefined'
        ? [...payload.passwords]
        : [...currentState.passwords];
    const newState: IUserState = { ...currentState, email, token, passwords, status };
    this.user.saveUser(newState);
    return ctx.patchState(newState);
  }

  @Action(logIn)
  public logIn(ctx: StateContext<IUserState>, { payload }: TLogInPayload) {
    return this.api
      .login({ email: payload.email, password: payload.password })
      .pipe(
        concatMap(user => this.api.getUserStatus().pipe(map(status => ({ user, status })))),
        tap(({ user, status }) => {
          const currentState: IUserState = ctx.getState();
          const newState: IUserState = {
            ...currentState,
            ...user,
            status,
          };
          this.user.saveUser(newState);
          ctx.patchState(newState);
        }),
      )
      .subscribe();
  }

  @Action(logOut)
  public logOut(ctx: StateContext<IUserState>, { payload }: TLogOutPayload) {
    return this.api
      .logout({ token: payload.token })
      .pipe(
        tap(result => {
          this.user.saveUser(userInitialState);
          ctx.patchState(userInitialState);
        }),
      )
      .subscribe();
  }

  @Action(configureUser)
  public configureUser(ctx: StateContext<IUserState>, { payload }: TConfigureUserPayload) {
    return this.api
      .configureUser({ ...payload })
      .pipe(
        tap(user => {
          const currentState: IUserState = ctx.getState();
          const email = user.email;
          const token = user.token;
          const status =
            typeof payload.status !== 'undefined'
              ? { ...currentState.status, ...payload.status }
              : { ...currentState.status };
          const passwords =
            typeof payload.passwords !== 'undefined'
              ? [...payload.passwords]
              : [...currentState.passwords];
          const newState: IUserState = { ...currentState, email, token, passwords, status };
          this.user.saveUser(newState);
          ctx.patchState(newState);
        }),
      )
      .subscribe();
  }

  @Action(getUser)
  public getUser(ctx: StateContext<IUserState>) {
    return combineLatest([this.api.getUser(), this.api.getUserStatus()]).pipe(
      map(([user, userStatus]) => {
        const currentState: IUserState = ctx.getState();
        const nextState: IUserState = {
          ...currentState,
          ...user,
          status: { ...userStatus },
        };
        this.user.saveUser(nextState);
        ctx.patchState(nextState);
        return nextState;
      }),
    );
  }

  @Action(listExportedPasswordFiles)
  public listExportedPasswordFiles(ctx: StateContext<IUserState>) {
    return this.api.listExportedPasswordFiles().pipe(
      tap(exported => {
        const currentState: IUserState = ctx.getState();
        ctx.patchState({ ...currentState, exportedPasswordFiles: [...exported] });
      }),
    );
  }

  @Action(addPassword)
  public addPassword(ctx: StateContext<IUserState>, { payload }: TAddPasswordPayload) {
    return this.api.addPassword(payload).pipe(
      tap(exported => {
        const currentState: IUserState = ctx.getState();
        ctx.patchState({ passwords: [...currentState.passwords, payload] });
      }),
    );
  }

  @Action(deletePassword)
  public deletePassword(ctx: StateContext<IUserState>, { payload }: TDeletePasswordPayload) {
    return this.api.deletePassword(payload).pipe(
      tap(user => {
        ctx.patchState({
          passwords: [...user.passwords],
        });
      }),
    );
  }

  @Action(encryptPasswords)
  public encryptPasswords(ctx: StateContext<IUserState>) {
    return this.api.encryptPasswords();
  }

  @Action(decryptPasswords)
  public decryptPasswords(ctx: StateContext<IUserState>) {
    return this.api.decryptPasswords();
  }

  @Action(exportPasswords)
  public exportPasswords(ctx: StateContext<IUserState>) {
    return this.api.exportPasswords();
  }

  @Action(generateKeypair)
  public generateKeypair(ctx: StateContext<IUserState>) {
    return this.api.generateKeypair();
  }
}
