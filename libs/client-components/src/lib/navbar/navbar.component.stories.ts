import { APP_BASE_HREF, DOCUMENT, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { array, text } from '@storybook/addon-knobs';
import { ArrayTypeKnobValue } from '@storybook/addon-knobs/dist/ts3.9/components/types';
import { AppClientMaterialModule } from '@upgraded-enigma/client-material';
import { AppUserState } from '@upgraded-enigma/client-store';
import {
  documentFactory,
  IButton,
  WEB_CLIENT_APP_ENV,
  WINDOW,
  windowFactory,
} from '@upgraded-enigma/client-util';

import { AppNavbarComponent } from './navbar.component';

export default {
  title: 'AppNavbarComponent',
};

const testingEnvironment = {
  production: false,
  platform: '',
  appName: 'Upgraded enigma',
  api: 'http://localhost:8080/api',
  envoyUrl: 'http://localhost:8081',
};

const buttons: IButton[] = [
  {
    routerLink: [''],
    icon: 'home',
    title: 'Home',
    requiresAuth: false,
  },
  {
    routerLink: ['info'],
    icon: 'av_timer',
    title: 'Diagnostics',
    requiresAuth: false,
  },
];

export const primary = () => ({
  moduleMetadata: {
    imports: [
      BrowserAnimationsModule,
      FlexLayoutModule,
      NgxsModule.forRoot([AppUserState]),
      AppClientMaterialModule.forRoot(),
    ],
    providers: [
      {
        provide: LocationStrategy,
        useClass: PathLocationStrategy,
      },
      { provide: WINDOW, useFactory: windowFactory },
      { provide: DOCUMENT, useFactory: documentFactory },
      { provide: APP_BASE_HREF, useValue: '/' },
      {
        provide: WEB_CLIENT_APP_ENV,
        useValue: testingEnvironment,
      },
    ],
  },
  component: AppNavbarComponent,
  props: {
    logoSrc: text('logoSrc', 'assets/icons/icon-72x72.png'),
    buttons: array('buttons', buttons as unknown as ArrayTypeKnobValue),
  },
});
