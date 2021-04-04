import { actionPayloadConstructor, IActionPayload } from '@upgraded-enigma/client-util';

import { IUserPassword, IUserStatePayload, USER_STATE_TOKEN } from './user.interface';

const createAction = actionPayloadConstructor(USER_STATE_TOKEN.getName());

export type TUserPayload = IActionPayload<IUserStatePayload>;

export const setState = createAction<TUserPayload>('set state');

export type TLogInPayload = IActionPayload<{ email: string; password: string }>;

export const logIn = createAction<TLogInPayload>('log in');

export const logOut = createAction('log out');

export type TConfigureUserPayload = IActionPayload<Partial<IUserStatePayload>>;

export const configureUser = createAction<TConfigureUserPayload>('configure user');

export const getUser = createAction('get user');

export const listExportedPasswordFiles = createAction('list exported password files');

export type TAddPasswordPayload = IActionPayload<IUserPassword>;

export const addPassword = createAction<TAddPasswordPayload>('add password');

export type TDeletePasswordPayload = IActionPayload<IUserPassword>;

export const deletePassword = createAction<TDeletePasswordPayload>('delete password');

export const encryptPasswords = createAction('encrypt passwords');

export const decryptPasswords = createAction('decrypt passwords');

export const exportPasswords = createAction('export passwords');

export const generateKeypair = createAction('generate keypair');
