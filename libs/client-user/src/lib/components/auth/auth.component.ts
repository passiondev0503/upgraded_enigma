import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppUserState, userActions } from '@app/client-store';
import { Store } from '@ngxs/store';
import { concatMap, first, tap } from 'rxjs/operators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppUserAuthComponent implements OnInit {
  constructor(private readonly fb: FormBuilder, private readonly router: Router, private readonly store: Store) {}

  @HostBinding('class.mat-body-1') protected matBody1 = true;

  /**
   * Login form.
   */
  public form = this.fb.group({
    email: ['', Validators.compose([Validators.required, Validators.email])],
    password: [
      '',
      Validators.compose([Validators.required, Validators.pattern(/[a-z]+/), Validators.pattern(/[A-Z]+/), Validators.pattern(/\d+/)]),
    ],
  });

  public ngOnInit() {
    void this.store
      .select(AppUserState.model)
      .pipe(
        first(),
        tap(user => {
          this.form.patchValue({ email: user.email, password: '' });
          this.form.updateValueAndValidity();
        }),
      )
      .subscribe();
  }

  /**
   * Resets login form.
   */
  public resetForm(): void {
    this.form.reset({
      email: null,
      password: null,
    });
    void this.store.dispatch(new userActions.setState({}));
  }

  /**
   * Submits login form.
   */
  public submitForm(): void {
    if (this.form.valid) {
      void this.store
        .select(AppUserState.model)
        .pipe(
          first(),
          concatMap(user => {
            const formData: { email: string; password: string } = this.form.value;
            return user.token ? this.logUserIn(formData) : this.initializeUser(formData);
          }),
        )
        .subscribe();
    }
  }

  private initializeUser(formData: { email: string; password: string }) {
    return this.store.dispatch(new userActions.configureUser(formData)).pipe(
      concatMap(() => {
        // make subsequent login request for user after successful initialization request
        const loginFormData = this.form.value;
        return this.store.dispatch(new userActions.logIn(loginFormData)).pipe(
          tap(
            () => {
              void this.router.navigate(['user']);
            },
            () => {
              void this.router.navigate(['auth']); // redirect to login in case of failure
            },
          ),
        );
      }),
    );
  }

  private logUserIn(formData: { email: string; password: string }) {
    return this.store.dispatch(new userActions.logIn(formData)).pipe(
      tap(
        () => {
          void this.router.navigate(['user']);
        },
        () => {
          void this.router.navigate(['auth']); // redirect to login in case of failure
        },
      ),
    );
  }
}
