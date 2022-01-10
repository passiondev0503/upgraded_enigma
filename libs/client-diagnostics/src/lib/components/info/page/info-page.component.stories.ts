import { DOCUMENT, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppClientMaterialModule } from '@app/client-material';
import { documentFactory, WEB_CLIENT_APP_ENV, WINDOW, windowFactory } from '@app/client-util';
import { Args, Story } from '@storybook/angular/types-6-0';

import { AppInfoPage } from './info-page.component';

const testingEnvironment = {
  production: false,
  platform: '',
  appName: 'Client',
  api: 'http://localhost:8080/api',
  envoyUrl: 'http://localhost:8081',
};

export default {
  title: 'AppInfoPage',
  component: AppInfoPage,
};

const story: Story<AppInfoPage> = (args: Args) => ({
  moduleMetadata: {
    imports: [BrowserAnimationsModule, FlexLayoutModule, AppClientMaterialModule.forRoot()],
    providers: [
      {
        provide: LocationStrategy,
        useClass: PathLocationStrategy,
      },
      { provide: WINDOW, useFactory: windowFactory },
      { provide: DOCUMENT, useFactory: documentFactory },
      {
        provide: WEB_CLIENT_APP_ENV,
        useValue: testingEnvironment,
      },
    ],
    declarations: [AppInfoPage],
  },
  props: {
    ...args,
  },
});

export const primary = story.bind({});
primary.args = {
  ping: 'ping result',
  markedInstructions: 'Marked instructions',
};
primary.parameters = {
  /**
   * Use legacy Angular renderer.
   * See docs https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#new-angular-renderer
   */
  angularLegacyRendering: true,
};
