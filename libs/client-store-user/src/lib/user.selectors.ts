import { createSelector } from '@ngrx/store';

import { IUserState, IUserStateModel } from './user.interface';

const selectFeature = (state: IUserState) => state.user;

const email = createSelector(selectFeature, (state: IUserStateModel) => state.email);
const token = createSelector(selectFeature, (state: IUserStateModel) => state.token);
const status = createSelector(selectFeature, (state: IUserStateModel) => state.status);
const passwords = createSelector(selectFeature, (state: IUserStateModel) => state.passwords);
const exportedPasswordFiles = createSelector(selectFeature, (state: IUserStateModel) => state.exportedPasswordFiles);
const userState = createSelector(selectFeature, (state: IUserStateModel) => state);

export const userSelectors = {
  email,
  token,
  status,
  passwords,
  exportedPasswordFiles,
  userState,
};
