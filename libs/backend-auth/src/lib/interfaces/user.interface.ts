import { IUser, IUserPassword, IUserStatus } from '@app/backend-interfaces';
import { Observable } from 'rxjs';

export interface IRsaKeys {
  public: string;
  private: string;
}

export type TUserConfigPayload = Partial<IUser>;

export interface IExportedPasswords {
  path: string;
  passwords: IUserPassword[];
}

export interface IUserService {
  readonly userConfigPath: string;

  readonly rsaPrivateKeyPath: string;

  readonly rsaPublicKeyPath: string;

  readonly userPasswordsExportPath: () => string;

  userKeyExists(privateKey?: boolean): Observable<boolean>;

  user(): Observable<IUser>;

  userStatus(): Observable<IUserStatus>;

  config(payload: TUserConfigPayload): Observable<IUser>;

  saveKeys(keyPair: IRsaKeys): Observable<IUser>;

  addPassword(payload: IUserPassword): Observable<IUser>;

  deletePassword(payload: IUserPassword): Observable<IUser | null>;

  exportPasswords(passwords: IUserPassword[]): Observable<IExportedPasswords>;

  listExportedPasswordFiles(): Observable<string[]>;
}
