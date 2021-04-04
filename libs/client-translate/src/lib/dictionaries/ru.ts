import { InjectionToken } from '@angular/core';

import { IUiDictionary } from '../interfaces/ui-dictionary.interface';

export const RU_DICTIONARY = new InjectionToken<IUiDictionary>('RU');

/**
 * Translate service shared dictionary: Russian.
 */
export const RU: IUiDictionary = {
  title: 'Органайзер',

  language: 'Язык',

  initialization: 'Инициализация пользовательской учётной записи',

  summary: 'Сводка',

  workspaces: 'Рабочие поверхности',

  generateKeypair: 'Сгенерировать пару RSA-ключей',

  login: 'Вход в систему',
  loginInstructions: 'Пожалуйста, введите адрес эл. почты и пароль',
  email: 'Эл. почта',
  password: 'Пароль',
  forgetMyAddress: 'Забудь мой адрес',

  logout: 'Выход',

  chat: {
    title: 'Чат',
    devices: 'Медиа устройства',
  },

  form: {
    clear: 'Очистить',
    submit: 'Отправить',
  },

  platform: {
    title: 'Платформа',
  },

  user: {
    title: 'Пользователь',
    status: 'Статус пользователя',
    sessions: 'Пользовательские сессии (по времени истечения)',
    initialized: 'Пользователь инициализирован',
    encryption: 'Шифрование включено',
  },

  data: 'Данные',
  sortBy: 'Сортировать по',
  pickDate: 'Выберите дату',
  addPassword: 'Добавить пароль',
  name: 'Название ресурса',
  timestamp: 'Метка времени',
  required: 'Это обязательное значение',
  delete: 'Удалить',
  passwords: {
    title: 'Пароли',
    count: 'Количество паролей',
    encrypt: 'Зашифровать пароли',
    decrypt: 'Расшифровать пароли',
    export: 'Экспортировать пароли',
    exported: 'Экспортированные пароли',
  },
};
