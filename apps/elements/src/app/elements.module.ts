import { CUSTOM_ELEMENTS_SCHEMA, DoBootstrap, Inject, Injector, NgModule, Provider } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsModule } from '@ngxs/store';
import { AppChatbotWidgetRootComponent, AppClientChatbotModule } from '@upgraded-enigma/client-chatbot';
import { AppClientCoreModule } from '@upgraded-enigma/client-core';
import { AppClientGqlModule } from '@upgraded-enigma/client-gql';
import { AppClientMaterialModule } from '@upgraded-enigma/client-material';
import { AppWebsocketModule } from '@upgraded-enigma/client-store';
import { AppClientTranslateModule } from '@upgraded-enigma/client-translate';
import { WINDOW } from '@upgraded-enigma/client-util';
import { EntityServiceClient } from '@upgraded-enigma/proto';

import { environment } from '../environments/environment';

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
    NgxsLoggerPluginModule.forRoot({ disabled: environment.production, collapsed: true }),
    NgxsRouterPluginModule.forRoot(),
    NgxsFormPluginModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AppClientCoreModule.forRoot(environment),
    AppClientMaterialModule.forRoot(),
    AppClientTranslateModule.forRoot(),
    AppClientGqlModule.forRoot(environment),
    AppWebsocketModule.forRoot(environment),
    RouterModule.forRoot([]),
    AppClientChatbotModule,
  ],
  providers: [...grpcProviders],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppElementsModule implements DoBootstrap {
  constructor(private readonly injector: Injector, @Inject(WINDOW) private readonly window: Window) {}

  public ngDoBootstrap() {
    this.registerChatbotWidget();
  }

  private registerChatbotWidget(): void {
    const chatbotWidget = createCustomElement<AppChatbotWidgetRootComponent>(AppChatbotWidgetRootComponent, {
      injector: this.injector,
    });
    if (!Boolean(this.window.customElements.get('app-chatbot-widget-root'))) {
      this.window.customElements.define('app-chatbot-widget-root', chatbotWidget);
    }
  }
}
