import { APP_BASE_HREF, DOCUMENT, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { Args, Story } from '@storybook/angular/types-6-0';
import { AppClientMaterialModule } from '@upgraded-enigma/client-material';
import { AppClientPipesModule } from '@upgraded-enigma/client-pipes';
import {
  AppChatbotModule,
  AppChatbotState,
  AppHttpProgressModule,
  AppSidebarModule,
  AppSidebarState,
  AppUserModule,
  AppUserState,
} from '@upgraded-enigma/client-store';
import { AppClientTranslateModule } from '@upgraded-enigma/client-translate';
import { documentFactory, IButton, WEB_CLIENT_APP_ENV, WINDOW, windowFactory } from '@upgraded-enigma/client-util';

import { AppToolbarComponent } from './toolbar.component';

const testingEnvironment = {
  production: false,
  platform: '',
  appName: 'Upgraded enigma',
  api: 'http://localhost:8080/api',
  envoyUrl: 'http://localhost:8081',
};

export default {
  title: 'AppToolbarComponent',
  component: AppToolbarComponent,
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

const story: Story<AppToolbarComponent> = (args: Args) => ({
  moduleMetadata: {
    imports: [
      BrowserAnimationsModule,
      FlexLayoutModule,
      HttpClientModule,
      RouterTestingModule,
      NgxsModule.forRoot([AppSidebarState, AppChatbotState, AppUserState]),
      AppClientMaterialModule.forRoot(),
      AppHttpProgressModule.forRoot(),
      AppClientTranslateModule,
      AppClientPipesModule,
      AppUserModule,
      AppChatbotModule,
      AppSidebarModule,
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
    declarations: [AppToolbarComponent],
  },
  props: {
    ...args,
  },
});

export const primary = story.bind({});
primary.args = {
  buttons: [...buttons],
};
primary.parameters = {
  /**
   * Use legacy Angular renderer.
   * See docs https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#new-angular-renderer
   */
  angularLegacyRendering: true,
};
