import { actionPayloadConstructor, IActionPayload } from '@app/client-util';

import { IUserPassword, IUserStatePayload, USER_STATE_TOKEN } from './user.interface';

const createAction = actionPayloadConstructor(USER_STATE_TOKEN.getName());

export type TUserPayload = IActionPayload<IUserStatePayload>;

const setState = createAction<TUserPayload>('set state');

export type TLogInPayload = IActionPayload<{ email: string; password: string }>;

const logIn = createAction<TLogInPayload>('log in');

const logOut = createAction('log out');

export type TConfigureUserPayload = IActionPayload<Partial<IUserStatePayload>>;

const configureUser = createAction<TConfigureUserPayload>('configure user');

const getUser = createAction('get user');

const listExportedPasswordFiles = createAction('list exported password files');

export type TAddPasswordPayload = IActionPayload<IUserPassword>;

const addPassword = createAction<TAddPasswordPayload>('add password');

export type TDeletePasswordPayload = IActionPayload<IUserPassword>;

const deletePassword = createAction<TDeletePasswordPayload>('delete password');

const encryptPasswords = createAction('encrypt passwords');

const decryptPasswords = createAction('decrypt passwords');

const exportPasswords = createAction('export passwords');

const generateKeypair = createAction('generate keypair');

export const userActions = {
  setState,
  logIn,
  logOut,
  configureUser,
  getUser,
  listExportedPasswordFiles,
  addPassword,
  deletePassword,
  encryptPasswords,
  decryptPasswords,
  exportPasswords,
  generateKeypair,
};
