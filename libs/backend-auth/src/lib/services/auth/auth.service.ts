import { AppMessage, IUser, IUserLoginCredentials, IUserLogoutCredentials } from '@app/backend-interfaces';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { IAuthPayload, IAuthService, IAuthTokenObject } from '../../interfaces/auth.interface';
import type { IUserService } from '../../interfaces/user.interface';
import { USER_SERVICE_TOKEN } from '../user/user.service';

export const AUTH_SERVICE_TOKEN = Symbol('AUTH_SERVICE_TOKEN');

@Injectable()
export class AppAuthService implements IAuthService {
  constructor(private readonly jwt: JwtService, @Inject(USER_SERVICE_TOKEN) private readonly userService: IUserService) {}

  public encryptStringWithRsaPublicKey(input: string, publicKey: crypto.RsaPublicKey | crypto.KeyLike) {
    const buffer = Buffer.from(input);
    const encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString('base64');
  }

  public decryptStringWithRsaPrivateKey(input: string, privateKey: crypto.RsaPrivateKey | crypto.KeyLike) {
    const buffer = Buffer.from(input, 'base64');
    const decrypted = crypto.privateDecrypt(privateKey, buffer);
    return decrypted.toString('utf8');
  }

  public generateJwtToken(payload: IAuthPayload) {
    const expires = new Date();
    const daysInWeek = 7;
    expires.setDate(expires.getDate() + daysInWeek);
    const token = this.jwt.sign(payload);
    return token;
  }

  public decryptJWToken(token: string) {
    const result = <IAuthTokenObject>this.jwt.decode(token);
    return result;
  }

  public ping() {
    return new AppMessage({
      message: 'Auth service is online. Public methods: login, logout, signup.',
    });
  }

  /**
   * Logs a user in.
   * @note TODO: review this method implementation.
   * @param payload user log in credentials
   * @returns
   */
  public login(payload: IUserLoginCredentials) {
    return this.authenticateAndReturnProfile(payload);
  }

  /**
   * Logs a user out.
   * @note TODO: reset the token when this method is called.
   * @param payload user logout credentials
   * @returns execution result
   */
  public logout(payload: IUserLogoutCredentials) {
    return this.userService
      .user()
      .pipe(
        switchMap(user =>
          user.token === payload.token ? of(true) : throwError(() => new Error('Something went wrong, the tokens do not match.')),
        ),
      );
  }

  private authenticateAndReturnProfile(payload: IUserLoginCredentials) {
    const name = {
      first: '',
      last: '',
    };
    const defaultProfile: IUser = {
      email: payload.email,
      token: this.generateJwtToken({
        email: payload.email,
        name: `${name.first} ${name.last}`,
      }),
      keys: {
        public: '',
        private: '',
      },
      encrypted: false,
      password: payload.password,
      passwords: [],
    };
    return this.userService.user().pipe(map(user => (user !== null ? user : defaultProfile)));
  }
}
