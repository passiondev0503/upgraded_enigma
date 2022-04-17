import { initializeClassProperties } from '../utils/class.util';
import { IUserPassword } from './user.interface';

export class UserPasswordPayload implements IUserPassword {
  public name = '';

  public password = '';

  public timestamp = 0;

  constructor(input?: UserPasswordPayload) {
    initializeClassProperties<UserPasswordPayload>(this, input);
  }
}
