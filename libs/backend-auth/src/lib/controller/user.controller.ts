import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { IUser, IUserPassword } from '@upgraded-enigma/backend-interfaces';
import { keypair } from 'keypair';
import { combineLatest, of, throwError } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { BackendAuthService } from '../service/auth.service';
import { BackendUserService } from '../service/user.service';

@Controller()
export class BackendUserController {
  private readonly rsaKeysExist$ = combineLatest([this.userService.userKeyExists(), this.userService.userKeyExists(true)]);

  constructor(private readonly userService: BackendUserService, private readonly authService: BackendAuthService) {}

  @Get('user')
  public user() {
    return this.userService.user();
  }

  @Get('user/status')
  public userStatus() {
    return this.userService.userStatus();
  }

  @Post('user/config')
  public configureUser(@Body() payload: Partial<IUser>) {
    return this.userService.config(payload);
  }

  @Post('user/password/add')
  public addPassword(@Body() payload: IUserPassword) {
    return this.userService.addPassword(payload);
  }

  @Delete('user/password/delete')
  public deletePassword(@Body() payload: IUserPassword) {
    return this.userService.deletePassword(payload);
  }

  @Post('user/rsa/generate')
  public generateRsaKeys() {
    return this.rsaKeysExist$.pipe(
      concatMap(([privateKeyExists, publicKeyExists]) => {
        if (privateKeyExists && publicKeyExists) {
          return throwError(new Error('Keys already exist.'));
        }
        const keysObject = keypair();
        return this.userService.saveKeys(keysObject).pipe(
          concatMap(savedKeys => {
            const userConfig = { keys: keysObject };
            return this.userService.config(userConfig).pipe(
              concatMap(user => {
                if (Object.keys(savedKeys).length && Object.keys(user).length) {
                  return of(user);
                }
                return throwError(new Error('Error updating user, check server logs for details.'));
              }),
            );
          }),
        );
      }),
    );
  }

  @Post('user/rsa/encrypt')
  public encryptDataWithRsaKeys() {
    return this.rsaKeysExist$.pipe(
      concatMap(([privateKeyExists, publicKeyExists]) => {
        if (!privateKeyExists || !publicKeyExists) {
          return throwError(new Error("Keys don't exist."));
        }
        return combineLatest([this.userService.user(), this.userService.userStatus()]).pipe(
          concatMap(([user, userStatus]) => {
            if (Object.keys(user).length && !userStatus.encrypted) {
              const result: IUser = {
                ...user,
                passwords: user.passwords.map(item => {
                  if (typeof user.keys.public !== 'undefined') {
                    item.password = this.authService.encryptStringWithRsaPublicKey(item.password, user.keys.public);
                  }
                  return item;
                }),
              };
              return this.userService.config({
                passwords: [...result.passwords],
                encrypted: true,
              });
            }
            return throwError(new Error(`Error encrypting data, check server logs for details. Data is ${userStatus.encrypted} now.`));
          }),
        );
      }),
    );
  }

  @Post('user/rsa/decrypt')
  public decryptDataWithRsaKeys() {
    return this.rsaKeysExist$.pipe(
      concatMap(([privateKeyExists, publicKeyExists]) => {
        if (!privateKeyExists || !publicKeyExists) {
          return throwError(new Error("Keys don't exist."));
        }
        return combineLatest([this.userService.user(), this.userService.userStatus()]).pipe(
          concatMap(([user, userStatus]) => {
            if (Object.keys(user).length && userStatus.encrypted) {
              const result: IUser = {
                ...user,
                passwords: user.passwords.map(item => {
                  if (typeof user.keys.private !== 'undefined') {
                    item.password = this.authService.decryptStringWithRsaPrivateKey(item.password, user.keys.private);
                  }
                  return item;
                }),
              };
              return this.userService.config({
                passwords: [...result.passwords],
                encrypted: false,
              });
            }
            return throwError(new Error(`Error decrypting data, check server logs for details. Data is ${userStatus.encrypted} now.`));
          }),
        );
      }),
    );
  }

  @Post('user/passwords/export')
  public exportUserPasswords() {
    return this.rsaKeysExist$.pipe(
      concatMap(([privateKeyExists, publicKeyExists]) => {
        if (!privateKeyExists || !publicKeyExists) {
          return throwError(new Error("Keys don't exist."));
        }
        return combineLatest([this.userService.user(), this.userService.userStatus()]).pipe(
          concatMap(([user, userStatus]) => {
            if (Object.keys(user).length) {
              const result: IUser = {
                ...user,
                passwords: userStatus.encrypted
                  ? user.passwords
                  : user.passwords.map(item => {
                      if (typeof user.keys.public !== 'undefined') {
                        item.password = this.authService.encryptStringWithRsaPublicKey(item.password, user.keys.public);
                      }
                      return item;
                    }),
              };
              return this.userService.exportPasswords(result.passwords);
            }
            return throwError(new Error('Error updating user, check server logs for details.'));
          }),
        );
      }),
    );
  }

  @Get('user/passwords/list/exported')
  public listExportedUserPasswords() {
    return this.userService.listExportedPasswordFiles();
  }
}
