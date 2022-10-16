import { AppMessage, IUser, IUserLoginCredentials, IUserLogoutCredentials } from '@app/backend-interfaces';
import * as crypto from 'crypto';
import { Observable } from 'rxjs';

export interface IAuthPayload {
  email: string;
  name: string;
}

export interface IAuthTokenObject extends IAuthPayload {
  expires: Date;
}

export interface IAuthService {
  encryptStringWithRsaPublicKey(input: string, publicKey: crypto.RsaPublicKey | crypto.KeyLike): string;

  decryptStringWithRsaPrivateKey(input: string, privateKey: crypto.RsaPrivateKey | crypto.KeyLike): string;

  generateJwtToken(payload: IAuthPayload): string;

  decryptJWToken(token: string): IAuthTokenObject;

  ping(): AppMessage;

  login(payload: IUserLoginCredentials): Observable<IUser>;

  logout(payload: IUserLogoutCredentials): Observable<boolean>;
}
