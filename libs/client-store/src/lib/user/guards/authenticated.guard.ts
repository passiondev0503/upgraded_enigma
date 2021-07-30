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
        if (!user.token || !user.email) {
          return this.router.createUrlTree(['/user', 'auth']);
        }
        return user.token ? true : false;
      }),
    );
  }
}
