import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppUserState } from '../user.store';

@Injectable({
  providedIn: 'root',
})
export class AppAuthenticatedGuard implements CanActivate {
  constructor(private readonly store: Store, private readonly router: Router) {}

  public canActivate(): Observable<boolean | UrlTree> {
    return this.store.selectOnce(AppUserState.model).pipe(
      map(user => {
        if (!Boolean(user.token) || !Boolean(user.email)) {
          const alertText = 'To access data you need to log in first. You will be redirected to the login page.';
          // eslint-disable-next-line no-alert -- needed here
          window.alert(alertText);
          return this.router.createUrlTree(['/user', 'auth']);
        }
        return Boolean(user.token) ? true : false;
      }),
    );
  }
}
