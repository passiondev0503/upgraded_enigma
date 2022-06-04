import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppUserState, ILoginPayload, userActions } from '@app/client-store';
import { Store } from '@ngxs/store';
import { BehaviorSubject } from 'rxjs';
import { concatMap, first, tap } from 'rxjs/operators';

type TPasswordInputType = 'password' | 'text';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppUserAuthComponent {
  @HostBinding('class.mat-body-1') protected matBody = true;

  /**
   * The auth form.
   */
  public form = this.fb.group({
    email: ['', Validators.compose([Validators.required, Validators.email])],
    password: ['', Validators.compose([Validators.required, Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{3,}$/)])], // TODO: undate the validator ^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?/~_+-=|\]).{8,32}$
  });

  private readonly passwordInputTypeSubject = new BehaviorSubject<TPasswordInputType>('password');

  public readonly passwordInputType$ = this.passwordInputTypeSubject.asObservable();

  constructor(private readonly fb: FormBuilder, private readonly router: Router, private readonly store: Store) {}

  public togglePasswordVisibility(): void {
    const nextValue = this.passwordInputTypeSubject.value === 'password' ? 'text' : 'password';
    this.passwordInputTypeSubject.next(nextValue);
  }

  /**
   * Resets the auth form.
   */
  public resetForm(): void {
    this.form.reset({
      email: null,
      password: null,
    });
    void this.store.dispatch(new userActions.setState({}));
  }

  /**
   * Submits the auth form.
   */
  public submitForm(): void {
    if (this.form.valid) {
      void this.store
        .select(AppUserState.model)
        .pipe(
          first(),
          concatMap(user => {
            const formData = <ILoginPayload>this.form.value;
            return typeof user.token !== 'undefined' ? this.logUserIn(formData) : this.initializeUser(formData);
          }),
        )
        .subscribe();
    }
  }

  /**
   * Initializes the user.
   * @param formData the auth form data
   * @returns execution result
   */
  private initializeUser(formData: ILoginPayload) {
    return this.store.dispatch(new userActions.configureUser(formData)).pipe(
      concatMap(() => {
        // make subsequent login request for user after successful initialization request
        const loginFormData = <ILoginPayload>this.form.value;
        return this.store.dispatch(new userActions.logIn(loginFormData)).pipe(
          tap({
            next: () => {
              void this.router.navigate(['user']);
            },
            error: () => {
              void this.router.navigate(['auth']);
            },
          }),
        );
      }),
    );
  }

  private logUserIn(formData: ILoginPayload) {
    return this.store.dispatch(new userActions.logIn(formData)).pipe(
      tap({
        next: () => {
          void this.router.navigate(['user']);
        },
        error: () => {
          void this.router.navigate(['auth']);
        },
      }),
    );
  }
}
