import { initializeClassProperties } from '../utils/class.util';
import { IUserPassword } from './user.interface';

export class AppUserPassword implements IUserPassword {
  public name = '';

  public password = '';

  public timestamp = 0;

  constructor(input?: AppUserPassword) {
    initializeClassProperties<AppUserPassword>(this, input);
  }
}
