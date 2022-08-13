import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ILoginPayload, IUserState, userActions, userSelectors } from '@app/client-store-user';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { first, tap } from 'rxjs/operators';

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

  constructor(private readonly fb: FormBuilder, private readonly store: Store<IUserState>) {}

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
    this.store.dispatch(userActions.setState({ payload: {} }));
  }

  /**
   * Submits the auth form.
   */
  public submitForm(): void {
    if (this.form.valid) {
      void this.store
        .select(userSelectors.userState)
        .pipe(
          first(),
          tap(user => {
            const formData = <ILoginPayload>this.form.value;
            if (typeof user.token !== 'undefined') {
              this.logUserIn(formData);
            } else {
              this.initializeUser(formData);
            }
          }),
        )
        .subscribe();
    }
  }

  /**
   * Initializes the user.
   * @param payload the login form data
   * @returns execution result
   */
  private initializeUser(payload: ILoginPayload) {
    this.store.dispatch(userActions.configureUser({ payload }));
    this.store.dispatch(userActions.login({ payload }));
  }

  private logUserIn(payload: ILoginPayload) {
    this.store.dispatch(userActions.login({ payload }));
  }
}
