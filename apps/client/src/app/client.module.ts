import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppCoreModule } from '@app/client-core';
import { AppCoreComponentsModule } from '@app/client-core-components';
import { AppMaterialModule } from '@app/client-material';
import { AppPwaOfflineModule } from '@app/client-pwa-offline';
import { AppRouterStoreModule } from '@app/client-store-router';
import { AppWebsocketStoreModule } from '@app/client-store-websocket';
import { AppTranslateModule } from '@app/client-translate';
import { metaReducers } from '@app/client-util-ngrx';
import { sentryProviders } from '@app/client-util-sentry';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AppElizaModule } from '@rfprodz/client-util-eliza';

import { environment } from '../environments/environment';
import { AppClientRoutingModule } from './client-routing.module';
import { AppRootComponent } from './components/root.component';

/**
 * The web client root module.
 */
@NgModule({
  imports: [
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularFireModule.initializeApp(environment.firebase ?? {}, 'organizer-833bc'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AppCoreComponentsModule,
    AppCoreModule.forRoot(environment),
    AppMaterialModule.forRoot(),
    StoreModule.forRoot({}, { metaReducers: metaReducers(environment.production) }),
    EffectsModule.forRoot(),
    AppWebsocketStoreModule.forRoot(environment),
    AppTranslateModule.forRoot(),
    AppElizaModule.forRoot(),
    AppPwaOfflineModule,
    AppClientRoutingModule,
    AppRouterStoreModule.forRoot(),
  ],
  providers: [...sentryProviders(environment)],
  declarations: [AppRootComponent],
  bootstrap: [AppRootComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppClientModule {}
