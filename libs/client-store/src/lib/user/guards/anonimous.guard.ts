import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { AppUserState } from '../user.state';

@Injectable({
  providedIn: 'root',
})
export class AppAnonimousGuard implements CanActivate {
  constructor(private readonly store: Store, private readonly router: Router) {}

  public canActivate(): Observable<boolean | UrlTree> {
    return this.store.selectOnce(AppUserState.model).pipe(
      first(),
      map(user => {
        if (typeof user.token !== 'undefined') {
          return this.router.createUrlTree(['/user']);
        }

        return typeof user.token === 'undefined' ? true : false;
      }),
    );
  }
}
