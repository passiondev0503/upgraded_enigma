import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IUserState } from '../user.interface';
import { userSelectors } from '../user.selectors';

@Injectable({
  providedIn: 'root',
})
export class AppAnonimousGuard implements CanActivate {
  constructor(private readonly store: Store<IUserState>, private readonly router: Router) {}

  public canActivate(): Observable<boolean | UrlTree> {
    return this.store.select(userSelectors.userState).pipe(
      map(user => {
        if (typeof user.token !== 'undefined') {
          return this.router.createUrlTree(['/user']);
        }

        return typeof user.token === 'undefined' ? true : false;
      }),
    );
  }
}
