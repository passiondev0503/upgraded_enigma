import { APP_BASE_HREF, DOCUMENT, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { array } from '@storybook/addon-knobs';
import { ArrayTypeKnobValue } from '@storybook/addon-knobs/dist/ts3.9/components/types';
import { AppClientMaterialModule } from '@upgraded-enigma/client-material';
import { AppChatbotState, AppSidebarState, AppUserState } from '@upgraded-enigma/client-store';
import {
  documentFactory,
  IButton,
  WEB_CLIENT_APP_ENV,
  WINDOW,
  windowFactory,
} from '@upgraded-enigma/client-util';

import { AppToolbarComponent } from './toolbar.component';

export default {
  title: 'AppToolbarComponent',
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
    routerLink: ['user/auth'],
    icon: 'input',
    title: 'Login',
    requiresAuth: false,
  },
  {
    routerLink: ['user'],
    icon: 'verified_user',
    title: 'User profile',
    requiresAuth: true,
  },
  {
    routerLink: ['user/data'],
    icon: 'dashboard',
    title: 'User data',
    requiresAuth: true,
  },
  {
    routerLink: ['user/rtc-chat'],
    icon: 'voice_chat',
    title: 'RTC Chat',
    requiresAuth: true,
  },
  {
    routerLink: ['workspaces'],
    icon: 'view_comfy',
    title: 'Workspaces',
    requiresAuth: true,
  },
  {
    routerLink: ['chatbot'],
    icon: 'chat',
    title: 'Chat',
    requiresAuth: true,
  },
];

export const primary = () => ({
  moduleMetadata: {
    imports: [
      BrowserAnimationsModule,
      FlexLayoutModule,
      NgxsModule.forRoot([AppSidebarState, AppChatbotState, AppUserState]),
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
  component: AppToolbarComponent,
  props: {
    buttons: array('anchors', (buttons as unknown) as ArrayTypeKnobValue),
  },
});
