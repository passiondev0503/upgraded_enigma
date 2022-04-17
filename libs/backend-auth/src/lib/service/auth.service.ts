import { IUser, IUserLoginCredentials, IUserLogoutCredentials, Message } from '@app/backend-interfaces';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { BackendUserService } from './user.service';

export interface IAuthPayload {
  email: string;
  name: string;
  expires: Date;
}

@Injectable()
export class BackendAuthService {
  constructor(private readonly jwt: JwtService, private readonly userService: BackendUserService) {}

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

  public generateJwtToken(payload: Omit<IAuthPayload, 'expires'>) {
    const expires = new Date();
    const daysInWeek = 7;
    expires.setDate(expires.getDate() + daysInWeek);
    const token = this.jwt.sign(payload);
    return token;
  }

  public decryptJWToken(token: string) {
    const result = this.jwt.decode(token) as IAuthPayload;
    return result;
  }

  public ping() {
    return new Message({
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
