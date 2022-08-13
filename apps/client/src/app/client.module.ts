import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppClientCoreModule } from '@app/client-core';
import { AppClientCoreComponentsModule } from '@app/client-core-components';
import { AppClientMaterialModule } from '@app/client-material';
import { AppClientPwaOfflineModule } from '@app/client-pwa-offline';
import { AppWebsocketStoreModule } from '@app/client-store-websocket';
import { AppClientTranslateModule } from '@app/client-translate';
import { AppRouteSerializer, metaReducers } from '@app/client-util-ngrx';
import { sentryProviders } from '@app/client-util-sentry';
import { EffectsModule } from '@ngrx/effects';
import { NavigationActionTiming, routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { AppClientUtilElizaModule } from '@rfprodz/client-util-eliza';

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
    AppClientCoreComponentsModule,
    AppClientCoreModule.forRoot(environment),
    AppClientMaterialModule.forRoot(),
    StoreModule.forRoot({ router: routerReducer }, { metaReducers: metaReducers(environment.production) }),
    EffectsModule.forRoot(),
    AppWebsocketStoreModule.forRoot(environment),
    AppClientTranslateModule.forRoot(),
    AppClientUtilElizaModule.forRoot(),
    AppClientPwaOfflineModule,
    AppClientRoutingModule,
    StoreRouterConnectingModule.forRoot({
      serializer: AppRouteSerializer,
      navigationActionTiming: NavigationActionTiming.PostActivation,
    }),
  ],
  providers: [...sentryProviders(environment)],
  declarations: [AppRootComponent],
  bootstrap: [AppRootComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppClientModule {}
