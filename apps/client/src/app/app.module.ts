import { CUSTOM_ELEMENTS_SCHEMA, NgModule, Provider } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppClientComponentsModule } from '@app/client-components';
import { AppClientCoreModule } from '@app/client-core';
import { AppClientMaterialModule } from '@app/client-material';
import { AppUserState, AppWebsocketModule } from '@app/client-store';
import { AppClientTranslateModule } from '@app/client-translate';
import { EntityServiceClient } from '@app/proto';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppRootComponent } from './components/root.component';

export const grpcProviders: Provider[] = [
  {
    provide: EntityServiceClient,
    useFactory: () => new EntityServiceClient(environment.envoyUrl ?? '', null, { withCredentials: 'true' }),
  },
];

/**
 * Application root module.
 */
@NgModule({
  imports: [
    BrowserAnimationsModule,
    NgxsModule.forRoot([], { developmentMode: !environment.production }),
    NgxsStoragePluginModule.forRoot({
      key: [AppUserState],
    }),
    NgxsLoggerPluginModule.forRoot({ disabled: environment.production, collapsed: true }),
    NgxsRouterPluginModule.forRoot(),
    NgxsFormPluginModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularFireModule.initializeApp(environment.firebase ?? {}, 'organizer-833bc'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AppClientComponentsModule,
    AppClientCoreModule.forRoot(environment),
    AppClientMaterialModule.forRoot(),
    AppWebsocketModule.forRoot(environment),
    AppClientTranslateModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [...grpcProviders],
  declarations: [AppRootComponent],
  bootstrap: [AppRootComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
