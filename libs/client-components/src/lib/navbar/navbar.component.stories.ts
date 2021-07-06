import { APP_BASE_HREF, DOCUMENT, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { Args, Story } from '@storybook/angular/types-6-0';
import { AppClientMaterialModule } from '@upgraded-enigma/client-material';
import { AppClientPipesModule } from '@upgraded-enigma/client-pipes';
import { AppHttpProgressModule, AppUserModule, AppUserState } from '@upgraded-enigma/client-store';
import { AppClientTranslateModule } from '@upgraded-enigma/client-translate';
import { documentFactory, WEB_CLIENT_APP_ENV, WINDOW, windowFactory } from '@upgraded-enigma/client-util';

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
      AppUserModule,
      AppHttpProgressModule.forRoot(),
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
      icon: 'home',
      title: 'Home',
      requiresAuth: false,
    },
    {
      routerLink: ['info'],
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
