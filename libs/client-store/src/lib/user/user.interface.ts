import { StateToken } from '@ngxs/store';

export interface IUserPassword {
  name: string;
  password: string;
  timestamp: number;
}

export interface IUserState {
  email: string;
  token: string;
  passwords: IUserPassword[];
  status: {
    initialized: boolean;
    encryption: boolean;
    encrypted: boolean;
  };
  exportedPasswordFiles: string[];
}

export const userInitialState: IUserState = {
  email: '',
  token: '',
  passwords: [],
  status: {
    initialized: false,
    encryption: false,
    encrypted: false,
  },
  exportedPasswordFiles: [],
};

export const USER_STATE_TOKEN = new StateToken<IUserState>('user');

export interface IUserStatePayload {
  email?: string;
  token?: string;
  passwords?: IUserPassword[];
  status?: {
    initialized?: boolean;
    encryption?: boolean;
    encrypted?: boolean;
  };
}

export interface IUserHandlers {
  setState(payload: IUserStatePayload): void;
}

export const USER_SERVICE_LOCAL_STORAGE_KEY = 'userSetvice';
