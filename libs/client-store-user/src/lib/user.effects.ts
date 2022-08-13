import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, from } from 'rxjs';
import { map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';

import { AppUserApiService } from './services/user-api.service';
import { userActions } from './user.actions';
import { IUserState, IUserStateModel } from './user.interface';
import { userSelectors } from './user.selectors';

@Injectable({
  providedIn: 'root',
})
export class AppUserEffects {
  public readonly login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.login),
      mergeMap(({ payload }) => this.api.login({ email: payload.email, password: payload.password })),
      mergeMap(() => from(this.router.navigate([{ outlets: { primary: ['user'] } }]))),
      map(() => userActions.getUser({ payload: { save: true } })),
    ),
  );

  public readonly logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.logout),
      withLatestFrom(this.store.select(userSelectors.token)),
      mergeMap(([action, token]) => this.api.logout({ token: token ?? '' })),
      tap(() => {
        localStorage.removeItem('user');
      }),
      map(() => userActions.resetState()),
    ),
  );

  public readonly resetState$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userActions.resetState.type),
        mergeMap(() => from(this.router.navigate([{ outlets: { primary: [''] } }]))),
      ),
    { dispatch: false },
  );

  public readonly configureUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.configureUser),
      mergeMap(({ payload }) => this.api.configureUser({ ...payload })),
      map(payload => userActions.setState({ payload })),
    ),
  );

  public readonly getUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.getUser),
      mergeMap(({ payload }) =>
        combineLatest([this.api.getUser(), this.api.getUserStatus()]).pipe(
          tap(([user, userStatus]) => {
            if (payload.save) {
              localStorage.setItem('user', JSON.stringify({ ...user, status: userStatus }));
            }
          }),
        ),
      ),
      map(([user, userStatus]) => {
        const payload: Partial<IUserStateModel> = {
          ...user,
          status: { ...userStatus },
        };
        return userActions.setState({ payload });
      }),
    ),
  );

  public readonly listExportedPasswordFiles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.listExportedPasswordFiles.type),
      mergeMap(() => this.api.listExportedPasswordFiles()),
      map(exported => userActions.setState({ payload: { exportedPasswordFiles: [...exported] } })),
    ),
  );

  public readonly addPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.addPassword),
      mergeMap(({ payload }) => this.api.addPassword(payload)),
      map(payload => userActions.setState({ payload: { passwords: [...payload.passwords] } })),
    ),
  );

  public readonly deletePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(userActions.deletePassword),
      mergeMap(({ payload }) => this.api.deletePassword(payload)),
      map(payload => userActions.setState({ payload: { passwords: [...payload.passwords] } })),
    ),
  );

  public readonly encryptPasswords$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userActions.encryptPasswords.type),
        mergeMap(() => this.api.encryptPasswords()),
      ),
    { dispatch: false },
  );

  public readonly decryptPasswords$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userActions.decryptPasswords.type),
        mergeMap(() => this.api.decryptPasswords()),
      ),
    { dispatch: false },
  );

  public readonly exportPasswords$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userActions.exportPasswords.type),
        mergeMap(() => this.api.exportPasswords()),
      ),
    { dispatch: false },
  );

  public readonly generateKeypair$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(userActions.generateKeypair.type),
        mergeMap(() => this.api.generateKeypair()),
      ),
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store<IUserState>,
    private readonly api: AppUserApiService,
    private readonly router: Router,
  ) {
    const user = localStorage.getItem('user');
    if (user !== null) {
      try {
        const payload: IUserStateModel = JSON.parse(user);
        this.store.dispatch(userActions.setState({ payload }));
      } catch (e) {
        // eslint-disable-next-line no-console -- log error when trying to restore a user
        console.error('Unable to restore the user model from the local storage.');
      }
    }
  }
}
