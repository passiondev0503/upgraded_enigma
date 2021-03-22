import { Injectable } from '@angular/core';

import { IUserState, USER_SERVICE_LOCAL_STORAGE_KEY } from './user.interface';

@Injectable({
  providedIn: 'root',
})
export class AppUserService {
  public restoreUser() {
    const userService = localStorage.getItem(USER_SERVICE_LOCAL_STORAGE_KEY);
    const user: IUserState =
      userService !== null && typeof userService !== 'undefined' ? JSON.parse(userService) : {};
    return user;
  }

  public saveUser(model: IUserState): void {
    localStorage.setItem(USER_SERVICE_LOCAL_STORAGE_KEY, JSON.stringify(model));
  }
}
