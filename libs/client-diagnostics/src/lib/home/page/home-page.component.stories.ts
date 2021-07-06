import { APP_BASE_HREF, DOCUMENT, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { Args, Story } from '@storybook/angular/types-6-0';
import { AppClientMaterialModule } from '@upgraded-enigma/client-material';
import { AppHttpProgressModule } from '@upgraded-enigma/client-store';
import { documentFactory, WEB_CLIENT_APP_ENV, WINDOW, windowFactory } from '@upgraded-enigma/client-util';

import { AppHomePage } from './home-page.component';

const testingEnvironment = {
  production: false,
  platform: '',
  appName: 'Upgraded enigma',
  api: 'http://localhost:8080/api',
  envoyUrl: 'http://localhost:8081',
};

export default {
  title: 'AppHomePage',
  component: AppHomePage,
};

const story: Story<AppHomePage> = (args: Args) => ({
  moduleMetadata: {
    imports: [
      BrowserAnimationsModule,
      FlexLayoutModule,
      AppClientMaterialModule.forRoot(),
      AppHttpProgressModule.forRoot(),
      NgxsModule.forRoot([]),
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
    declarations: [AppHomePage],
  },
  props: {
    ...args,
  },
});

export const primary = story.bind({});
primary.args = {
  timer: '1',
  markedInstructions: 'Marked instructions',
};
primary.parameters = {
  /**
   * Use legacy Angular renderer.
   * See docs https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#new-angular-renderer
   */
  angularLegacyRendering: true,
};
