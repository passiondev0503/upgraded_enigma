import { InjectionToken } from '@angular/core';

import { IUiDictionary } from '../interfaces/ui-dictionary.interface';

export const EN_DICTIONARY = new InjectionToken<IUiDictionary>('EN');

/**
 * Translate service shared dictionary: ENssian.
 */
export const EN: IUiDictionary = {
  title: 'Organizer',

  language: 'Language',

  initialization: 'User account initialization',

  summary: 'Summary',

  workspaces: 'Workspaces',

  generateKeypair: 'Generate RSA keypair',

  login: 'Log in',
  loginInstructions: 'Provide an email and a password, please',
  email: 'Email',
  password: 'Password',
  forgetMyAddress: 'Forget my address',

  logout: 'Log out',

  chat: {
    title: 'Chat',
    devices: 'Media devices',
  },

  form: {
    clear: 'Clear',
    submit: 'Submit',
  },

  platform: {
    title: 'Platform',
  },

  user: {
    title: 'User',
    status: 'User status',
    sessions: 'User sessions (by expiration date)',
    initialized: 'User initialized',
    encryption: 'Encryption enabled',
  },

  data: 'Data',
  sortBy: 'Sort by',
  pickDate: 'Pick a date',
  addPassword: 'Add password',
  name: 'Resource name',
  timestamp: 'Timestamp',
  required: 'This value is required',
  delete: 'Delete',
  passwords: {
    title: 'Passwords',
    count: 'Passwords count',
    encrypt: 'Encrypt passwords',
    decrypt: 'Decrypt passwords',
    export: 'Export passwords',
    exported: 'Exported passwords',
  },
};
