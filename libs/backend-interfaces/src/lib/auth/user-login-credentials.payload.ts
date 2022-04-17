import { initializeClassProperties } from '../utils/class.util';
import { IUserLoginCredentials } from './user.interface';

export class UserLoginCredentialsPayload implements IUserLoginCredentials {
  public email = '';

  public password = '';

  constructor(input?: UserLoginCredentialsPayload) {
    initializeClassProperties<UserLoginCredentialsPayload>(this, input);
  }
}
