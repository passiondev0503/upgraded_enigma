import 'hammerjs';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { initializeSentry } from '@app/client-services';
import { applicationIsFramed } from '@app/client-util';

import { AppClientModule } from './app/client.module';
import { environment } from './environments/environment';

if (applicationIsFramed()) {
  console.error('It is forbidden to bootstrap the application in an iframe.');
} else {
  if (environment.production) {
    enableProdMode();
  }

  /**
   * The client app release identifier.
   */
  const clientReleaseId = `${environment.appName
    .split(' ')
    .map(item => item.toLowerCase())
    .join('-')}@${environment.meta.version}`;

  initializeSentry(environment, clientReleaseId);

  platformBrowserDynamic()
    .bootstrapModule(AppClientModule)
    .catch(err => {
      console.error(err);
    });
}
