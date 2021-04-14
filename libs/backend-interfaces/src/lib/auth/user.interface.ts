import { KeyLike, RsaPrivateKey, RsaPublicKey } from 'node:crypto';

export interface IUserPassword {
  name: string;
  password: string;
  timestamp: number;
}

export interface IUserKeys {
  public?: RsaPublicKey | KeyLike;
  private?: RsaPrivateKey | KeyLike;
}

export interface IUser {
  email: string;
  password: string;
  token: string;
  keys: IUserKeys;
  passwords: IUserPassword[];
  encrypted: boolean;
}

export const userObject = (values: Partial<IUser>): IUser => ({
  email: values.email ?? '',
  password: values.password ?? '',
  token: values.token ?? '',
  keys: {
    public: values.keys?.public ?? void 0,
    private: values.keys?.private ?? void 0,
  },
  passwords: values.passwords ?? [],
  encrypted: values.encrypted ?? false,
});

export interface IUserStatus {
  initialized: boolean;
  encryption: boolean;
  encrypted: boolean;
}

export const userStatusObject = (values: Partial<IUserStatus>): IUserStatus => ({
  initialized: values.initialized ?? false,
  encryption: values.encryption ?? false,
  encrypted: values.encrypted ?? false,
});

export interface IUserLoginCredentials {
  email: string;
  password: string;
}

export interface IUserLogoutCredentials {
  token: string;
}
