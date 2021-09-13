import { APP_BASE_HREF, DOCUMENT, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AppClientMaterialModule } from '@app/client-material';
import { AppClientPipesModule } from '@app/client-pipes';
import { AppHttpProgressStoreModule, AppUserState, AppUserStoreModule } from '@app/client-store';
import { AppClientTranslateModule } from '@app/client-translate';
import { documentFactory, WEB_CLIENT_APP_ENV, WINDOW, windowFactory } from '@app/client-util';
import { NgxsModule } from '@ngxs/store';
import { Args, Story } from '@storybook/angular/types-6-0';

import { AppNavbarComponent } from './navbar.component';

const testingEnvironment = {
  production: false,
  platform: '',
  appName: 'Upgraded enigma',
  api: 'http://localhost:8080/api',
  envoyUrl: 'http://localhost:8081',
};

export default {
  title: 'AppNavbarComponent',
  component: AppNavbarComponent,
};

const story: Story<AppNavbarComponent> = (args: Args) => ({
  moduleMetadata: {
    imports: [
      BrowserAnimationsModule,
      FlexLayoutModule,
      HttpClientModule,
      RouterTestingModule,
      AppClientMaterialModule.forRoot(),
      NgxsModule.forRoot([AppUserState]),
      AppUserStoreModule,
      AppHttpProgressStoreModule.forRoot(),
      AppClientTranslateModule,
      AppClientPipesModule,
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
    declarations: [AppNavbarComponent],
  },
  props: {
    ...args,
  },
});

export const primary = story.bind({});
primary.args = {
  logoSrc: 'assets/icons/icon-72x72.png',
  buttons: [
    {
      routerLink: [''],
      routeActive: () => false,
      icon: 'home',
      title: 'Home',
      requiresAuth: false,
    },
    {
      routerLink: ['info'],
      routeActive: () => false,
      icon: 'av_timer',
      title: 'Diagnostics',
      requiresAuth: true,
    },
  ],
};
primary.parameters = {
  /**
   * Use legacy Angular renderer.
   * See docs https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#new-angular-renderer
   */
  angularLegacyRendering: true,
};
