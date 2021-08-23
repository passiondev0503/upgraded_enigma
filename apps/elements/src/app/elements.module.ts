import { CUSTOM_ELEMENTS_SCHEMA, DoBootstrap, Inject, Injector, NgModule, Provider } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AppChatbotWidgetRootComponent, AppClientChatbotModule } from '@app/client-chatbot';
import { AppClientCoreModule } from '@app/client-core';
import { AppClientMaterialModule } from '@app/client-material';
import { AppWebsocketModule } from '@app/client-store';
import { AppClientTranslateModule } from '@app/client-translate';
import { WINDOW } from '@app/client-util';
import { EntityServiceClient } from '@app/proto';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsModule } from '@ngxs/store';

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
    if (typeof this.window.customElements.get('app-chatbot-widget-root') === 'undefined') {
      this.window.customElements.define('app-chatbot-widget-root', chatbotWidget);
    }
  }
}
