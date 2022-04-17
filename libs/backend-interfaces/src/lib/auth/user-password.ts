import { initializeClassProperties } from '../utils/class.util';
import { IUserPassword } from './user.interface';

export class UserPassword implements IUserPassword {
  public name = '';

  public password = '';

  public timestamp = 0;

  constructor(input?: UserPassword) {
    initializeClassProperties<UserPassword>(this, input);
  }
}
