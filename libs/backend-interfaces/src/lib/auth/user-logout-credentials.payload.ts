import { initializeClassProperties } from '../utils/class.util';
import { IUserLogoutCredentials } from './user.interface';

export class UserLogoutCredentialsPayload implements IUserLogoutCredentials {
  public token = '';

  constructor(input?: UserLogoutCredentialsPayload) {
    initializeClassProperties<UserLogoutCredentialsPayload>(this, input);
  }
}
