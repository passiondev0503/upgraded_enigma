import { TestBed, waitForAsync } from '@angular/core/testing';

import { IUiDictionary } from '../interfaces';
import { RU, RU_DICTIONARY } from './ru';

describe('Russian shared translations', () => {
  let dictionary: IUiDictionary;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        providers: [
          {
            provide: RU_DICTIONARY,
            useValue: RU,
          },
        ],
      })
        .compileComponents()
        .then(() => {
          dictionary = TestBed.inject(RU_DICTIONARY);
        });
    }),
  );

  it('should create the app', () => {
    expect(dictionary).toEqual(
      jasmine.objectContaining({
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
      }),
    );
  });
});
