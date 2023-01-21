import { APP_BASE_HREF, DOCUMENT, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { TestBed, TestModuleMetadata, waitForAsync } from '@angular/core/testing';
import {
  documentFactory,
  IWebClientAppEnvironment,
  NAVIGATOR,
  navigatorFactory,
  WEB_CLIENT_APP_ENV,
  WINDOW,
  windowFactory,
} from '@app/client-util';

import { appClientCoreModuleProviders } from './client-core-module.providers';

describe('client-core-module-proviers', () => {
  const testingEnvironment: IWebClientAppEnvironment = {
    production: false,
    platform: 'web',
    appName: 'Testing Environment',
    description: 'Testing description',
    api: window.location.origin.includes('localhost') ? 'http://localhost:8080/api' : `${window.location.origin}/api`,
    sentry: {
      env: 'testing-unit',
      dsn: '',
      tracingOrigins: [],
      tracesSampleRate: 0.0,
    },
    meta: {
      version: 'N/A',
    },
  };

  const testBedConfig: TestModuleMetadata = {
    providers: [...appClientCoreModuleProviders(testingEnvironment)],
  };

  let locationStrategy: LocationStrategy;
  let appBaseHref: string;
  let win: Window;
  let doc: Document;
  let nav: Navigator;
  let env: IWebClientAppEnvironment;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule(testBedConfig)
      .compileComponents()
      .then(() => {
        locationStrategy = TestBed.inject(LocationStrategy);
        appBaseHref = TestBed.inject(APP_BASE_HREF);
        win = TestBed.inject(WINDOW);
        doc = TestBed.inject(DOCUMENT);
        nav = TestBed.inject(NAVIGATOR);
        env = TestBed.inject(WEB_CLIENT_APP_ENV);
      });
  }));

  it('appClientCoreModuleProviders should provide expected providers', () => {
    expect(locationStrategy instanceof PathLocationStrategy).toBeTruthy();
    expect(appBaseHref).toEqual('/');
    expect(win).toEqual(windowFactory());
    expect(doc).toEqual(documentFactory());
    expect(nav).toEqual(navigatorFactory());
    expect(env).toMatchObject(testingEnvironment);
  });
});
