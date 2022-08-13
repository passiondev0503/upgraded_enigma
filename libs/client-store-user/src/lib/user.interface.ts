export interface IUserPassword {
  name: string;
  password: string;
  timestamp: number;
}

export interface IUserStateModel {
  email?: string;
  token?: string;
  passwords?: IUserPassword[];
  status: {
    initialized: boolean;
    encryption: boolean;
    encrypted: boolean;
  };
  exportedPasswordFiles: string[];
}

export interface IUserState {
  user: IUserStateModel;
}

export const featureName: keyof IUserState = 'user';

export interface ILoginPayload {
  email: string;
  password: string;
}
