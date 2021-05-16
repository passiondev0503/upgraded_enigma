import { Injectable } from '@nestjs/common';
import { IUser, IUserPassword, IUserStatus, userObject, userStatusObject } from '@upgraded-enigma/backend-interfaces';
import * as fs from 'fs';
import { Glob } from 'glob';
import { Observable } from 'rxjs';

@Injectable()
export class BackendUserService {
  private readonly cwd = process.cwd();

  public readonly userConfigPath = `${this.cwd}/.config/user.json`;

  public readonly rsaPrivateKeyPath = `${this.cwd}/.config/rsa.private`;

  public readonly rsaPublicKeyPath = `${this.cwd}/.config/rsa.public`;

  public readonly userPasswordsExportPath = () => `${this.cwd}/.config/export.${new Date().getTime()}.json`;

  /**
   * Checks if user rsa key (either private or public) exists.
   */
  public userKeyExists(privateKey?: boolean) {
    return new Observable<boolean>(observer => {
      const keyPath = Boolean(privateKey) ? this.rsaPrivateKeyPath : this.rsaPublicKeyPath;
      fs.readFile(keyPath, (error, data) => {
        if (error !== null) {
          observer.error(error);
        } else {
          observer.next(true);
          observer.complete();
        }
      });
    });
  }

  /**
   * Returns user object.
   * Creates default user object if user config does not exist.
   */
  public user() {
    return new Observable<IUser>(observer => {
      fs.readFile(this.userConfigPath, (readError, data) => {
        if (readError !== null) {
          fs.writeFile(this.userConfigPath, JSON.stringify(userObject({})), writeError => {
            if (writeError !== null) {
              observer.error(writeError);
            } else {
              observer.next(userObject({}));
              observer.complete();
            }
          });
        } else {
          const user: IUser = JSON.parse(data.toString());
          observer.next(user);
          observer.complete();
        }
      });
    });
  }

  /**
   * Returns user status object based on user configuration.
   */
  public userStatus() {
    return new Observable<IUserStatus>(observer => {
      fs.readFile(this.userConfigPath, (readError, data) => {
        if (readError !== null) {
          observer.error(readError);
        } else {
          const user: IUser = JSON.parse(data.toString());
          const userStatus = userStatusObject({
            initialized: Boolean(user.email) && Boolean(user.password),
            encryption: Boolean(user.keys.public) && Boolean(user.keys.private),
            encrypted: user.encrypted,
          });
          observer.next(userStatus);
          observer.complete();
        }
      });
    });
  }

  /**
   * Configures user.
   */
  public config(newValues: Partial<IUser>) {
    return new Observable<IUser>(observer => {
      fs.readFile(this.userConfigPath, (readError, data) => {
        if (readError !== null) {
          observer.error(readError);
        } else {
          const user: IUser = JSON.parse(data.toString());

          for (const [key, value] of Object.entries(newValues)) {
            if (key in user) {
              user[key] = value;
            }
          }

          fs.writeFile(this.userConfigPath, JSON.stringify(user), writeError => {
            if (writeError !== null) {
              observer.error(writeError);
            } else {
              observer.next(user);
              observer.complete();
            }
          });
        }
      });
    });
  }

  /**
   * Saves user RSA keys to files.
   */
  public saveKeys(keyPair: { public: string; private: string }) {
    return new Observable<IUser>(observer => {
      fs.readFile(this.userConfigPath, (readError, data) => {
        if (readError !== null) {
          observer.error(readError);
        } else {
          const user = JSON.parse(data.toString());
          fs.writeFile(this.rsaPrivateKeyPath, JSON.stringify(keyPair.private), writeError1 => {
            if (writeError1 !== null) {
              observer.error(writeError1);
            }
            fs.writeFile(this.rsaPublicKeyPath, JSON.stringify(keyPair.public), writeError2 => {
              if (writeError2 !== null) {
                observer.error(writeError2);
              }
              observer.next(user);
              observer.complete();
            });
          });
        }
      });
    });
  }

  /**
   * Adds a password.
   */
  public addPassword(passwordObject: IUserPassword) {
    return new Observable<IUser>(observer => {
      fs.readFile(this.userConfigPath, (readError, data) => {
        if (readError !== null) {
          observer.error(readError);
        } else {
          const user: IUser = JSON.parse(data.toString());

          passwordObject.timestamp = new Date().getTime();
          user.passwords.push(passwordObject);

          fs.writeFile(this.userConfigPath, JSON.stringify(user), writeError => {
            if (writeError !== null) {
              observer.error(writeError);
            } else {
              observer.next(user);
              observer.complete();
            }
          });
        }
      });
    });
  }

  /**
   * Deletes a password.
   */
  public deletePassword(passwordObject: IUserPassword) {
    return new Observable<IUser | null>(observer => {
      fs.readFile(this.userConfigPath, (readError, data) => {
        if (readError !== null) {
          observer.error(readError);
        } else {
          const user: IUser = JSON.parse(data.toString());

          user.passwords = user.passwords.filter(item => item.name !== passwordObject.name && item.password !== passwordObject.password);

          fs.writeFile(this.userConfigPath, JSON.stringify(user), writeError => {
            if (writeError !== null) {
              observer.error(writeError);
            } else {
              observer.next(user);
              observer.complete();
            }
          });
        }
      });
    });
  }

  /**
   * Exports passwords.
   */
  public exportPasswords(passwords: IUserPassword[]) {
    const exportPath = this.userPasswordsExportPath();
    return new Observable<{ path: string; passwords: IUserPassword[] }>(observer => {
      const data = JSON.stringify(passwords);
      fs.writeFile(exportPath, data, writeError => {
        if (writeError !== null) {
          observer.error(writeError);
        }
        observer.next({ path: exportPath, passwords: passwords });
        observer.complete();
      });
    });
  }

  /**
   * Lists exported password files.
   */
  public listExportedPasswordFiles() {
    return new Observable<string[]>(observer => {
      new Glob('config/export.*.json', {}, (error, files) => {
        if (error !== null) {
          observer.error(error);
        }
        observer.next(files);
        observer.complete();
      });
    });
  }
}
