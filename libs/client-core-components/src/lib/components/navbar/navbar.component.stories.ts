import { APP_BASE_HREF, DOCUMENT, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AppMaterialModule } from '@app/client-material';
import { AppPipesModule } from '@app/client-pipes';
import { AppSidebarStoreModule } from '@app/client-store-sidebar';
import { AppTranslateModule } from '@app/client-translate';
import { documentFactory, routerButton, WEB_CLIENT_APP_ENV, WINDOW, windowFactory } from '@app/client-util';
import { EffectsModule } from '@ngrx/effects';
import { NavigationActionTiming, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { Args, Story } from '@storybook/angular/types-6-0';
import { of } from 'rxjs';

import { AppNavbarComponent } from './navbar.component';

const testingEnvironment = {
  production: false,
  platform: '',
  appName: 'Upgraded enigma',
  api: 'http://localhost:8080/api',
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
      AppMaterialModule.forRoot(),
      StoreModule.forRoot({}),
      EffectsModule.forRoot(),
      AppSidebarStoreModule.forRoot(),
      AppTranslateModule,
      AppPipesModule,
      RouterModule,
      StoreRouterConnectingModule.forRoot({
        navigationActionTiming: NavigationActionTiming.PostActivation,
      }),
    ],
    providers: [
      {
        provide: Router,
        useValue: {
          events: of(true),
          navigate: () => new Promise<boolean>(resolve => resolve(true)),
        },
      },
      { provide: ActivatedRoute, useValue: {} },
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
    routerButton('Home', 'home', () => false, [{ outlets: { primary: [''], sidebar: [] } }], false),
    routerButton('Diagnostics', 'av_timer', () => false, [{ outlets: { primary: ['info'], sidebar: [] } }], false),
  ],
  auth: { authenticated: true },
};
primary.parameters = {
  /**
   * Use legacy Angular renderer.
   * See docs https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#new-angular-renderer
   */
  // angularLegacyRendering: true,
};
