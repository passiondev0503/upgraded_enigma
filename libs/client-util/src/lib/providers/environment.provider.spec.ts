import { TestBed, TestModuleMetadata, waitForAsync } from '@angular/core/testing';

import { IWebClientAppEnvironment } from '../interfaces/environment.interface';
import { environmentProvider, WEB_CLIENT_APP_ENV } from './environment.provider';

describe('environmentProvider', () => {
  const testingEnvironment: IWebClientAppEnvironment = {
    api: '',
    appName: '',
    description: '',
    platform: '',
    production: false,
    sentry: {
      dsn: '',
      env: 'testing-unit',
      tracesSampleRate: 1.0,
      tracingOrigins: [],
    },
    firebase: {
      apiKey: '',
      authDomain: '',
      databaseURL: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
      measurementId: '',
      defaultRtcRoomId: '',
    },
    meta: {
      version: 'N/A',
    },
  };

  const testBedConfig: TestModuleMetadata = {
    providers: [environmentProvider(testingEnvironment)],
  };

  let provider: IWebClientAppEnvironment;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule(testBedConfig)
      .compileComponents()
      .then(() => {
        provider = TestBed.inject(WEB_CLIENT_APP_ENV);
      });
  }));

  it('should be defined', () => {
    expect(provider).toBeDefined();
    expect(provider).toEqual(testingEnvironment);
  });
});
