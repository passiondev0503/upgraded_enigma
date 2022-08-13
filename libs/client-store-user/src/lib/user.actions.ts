import { createAction, props } from '@ngrx/store';

import { featureName, ILoginPayload, IUserPassword, IUserStateModel } from './user.interface';

const type = (name: string) => `[${featureName}] ${name}`;

const login = createAction(type('login'), props<{ payload: ILoginPayload }>());

const logout = createAction(type('logout'));

const configureUser = createAction(type('configure user'), props<{ payload: Partial<IUserStateModel> }>());

const setState = createAction(type('set state'), props<{ payload: Partial<IUserStateModel> }>());

const resetState = createAction(type('reset state'));

const getUser = createAction(type('get user'), props<{ payload: { save: boolean } }>());

const listExportedPasswordFiles = createAction(type('list exported password files'));

const addPassword = createAction(type('add password'), props<{ payload: IUserPassword }>());

const deletePassword = createAction(type('delete password'), props<{ payload: IUserPassword }>());

const encryptPasswords = createAction(type('encrypt passwords'));

const decryptPasswords = createAction(type('decrypt passwords'));

const exportPasswords = createAction(type('export passwords'));

const generateKeypair = createAction(type('generate keypair'));

export const userActions = {
  getUser,
  login,
  logout,
  configureUser,
  setState,
  resetState,
  listExportedPasswordFiles,
  addPassword,
  deletePassword,
  encryptPasswords,
  decryptPasswords,
  exportPasswords,
  generateKeypair,
};
