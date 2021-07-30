import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '@app/client-util';

import { AppHttpHandlersService } from '../http-api/http-handlers.service';

/**
 * @note TODO: replace this DTOs with proto-based definitions
 */

export interface IUserPasswordDto {
  name: string;
  password: string;
  timestamp: number;
}

export interface IUserStatusDto {
  initialized: boolean;
  encryption: boolean;
  encrypted: boolean;
}

export interface IUserDto {
  email: string;
  password: string;
  token: string;
  keys: {
    public: string;
    private: string;
  };
  passwords: IUserPasswordDto[];
  encrypted: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AppUserApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly httpHandlers: AppHttpHandlersService,
    @Inject(WINDOW) private readonly window: Window,
  ) {}

  /**
   * Service endpoints.
   */
  private readonly endpoints = {
    login: this.window.location.origin + '/api/auth/login',
    logout: this.window.location.origin + '/api/auth/logout',
    user: this.window.location.origin + '/api/user',
    config: this.window.location.origin + '/api/user/config',
    status: this.window.location.origin + '/api/user/status',
    addPassword: this.window.location.origin + '/api/user/password/add',
    deletePassword: this.window.location.origin + '/api/user/password/delete',
    generateKeypair: this.window.location.origin + '/api/user/rsa/generate',
    encryptPasswords: this.window.location.origin + '/api/user/rsa/encrypt',
    decryptPasswords: this.window.location.origin + '/api/user/rsa/decrypt',
    exportPasswords: this.window.location.origin + '/api/user/passwords/export',
    listExportedPasswordFiles: this.window.location.origin + '/api/user/passwords/list/exported',
  };

  /**
   * Gets user.
   */
  public getUser() {
    return this.httpHandlers.pipeHttpResponse<IUserDto>(this.http.get<IUserDto>(this.endpoints.user));
  }

  /**
   * Gets user status.
   */
  public getUserStatus() {
    return this.httpHandlers.pipeHttpResponse<IUserStatusDto>(this.http.get<IUserStatusDto>(this.endpoints.status));
  }

  /**
   * Logs user in.
   */
  public login(formData: { email: string; password: string }) {
    return this.httpHandlers.pipeHttpResponse<IUserDto>(this.http.post<IUserDto>(this.endpoints.login, formData));
  }

  /**
   * Logs user out.
   */
  public logout(formData: { token: string }) {
    return this.httpHandlers.pipeHttpResponse<{ message: string }>(this.http.post<{ message: string }>(this.endpoints.logout, formData));
  }

  /**
   * Configures user.
   */
  public configureUser(formData: Partial<IUserDto>) {
    return this.httpHandlers.pipeHttpResponse<IUserDto>(this.http.post<IUserDto>(this.endpoints.config, formData));
  }

  /**
   * Adds user password.
   */
  public addPassword(formData: IUserPasswordDto) {
    return this.httpHandlers.pipeHttpResponse<IUserDto>(this.http.post<IUserDto>(this.endpoints.addPassword, formData));
  }

  /**
   * Deletes user password.
   */
  public deletePassword(formData: IUserPasswordDto) {
    return this.httpHandlers.pipeHttpResponse<IUserDto>(this.http.post<IUserDto>(this.endpoints.deletePassword, formData));
  }

  /**
   * Generates RSA keypair for a user.
   */
  public generateKeypair() {
    return this.httpHandlers.pipeHttpResponse<IUserDto>(this.http.post<IUserDto>(this.endpoints.generateKeypair, {}));
  }

  /**
   * Encrypts user passwords with user public RSA key.
   */
  public encryptPasswords() {
    return this.httpHandlers.pipeHttpResponse<IUserDto>(this.http.post<IUserDto>(this.endpoints.encryptPasswords, {}));
  }

  /**
   * Decrypts user passwords with user private RSA key.
   */
  public decryptPasswords() {
    return this.httpHandlers.pipeHttpResponse<IUserDto>(this.http.post<IUserDto>(this.endpoints.decryptPasswords, {}));
  }

  /**
   * Exports user passwords.
   */
  public exportPasswords() {
    return this.httpHandlers.pipeHttpResponse<{ path: string; passwords: IUserPasswordDto }>(
      this.http.get<{ path: string; passwords: IUserPasswordDto }>(this.endpoints.exportPasswords),
    );
  }

  /**
   * Lists exported passwords.
   */
  public listExportedPasswordFiles() {
    return this.httpHandlers.pipeHttpResponse<string[]>(this.http.get<string[]>(this.endpoints.listExportedPasswordFiles));
  }
}
