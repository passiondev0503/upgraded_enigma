import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '@app/client-material';
import { AppPwaOfflineModule } from '@app/client-pwa-offline';
import { AppRouterStoreModule } from '@app/client-store-router';
import { appBaseHrefProvider, documentProvider, pathLocationStrategyProvider, windowProvider } from '@app/client-util';
import { metaReducers } from '@app/client-util-ngrx';
import { StoreModule } from '@ngrx/store';
import { MarkdownModule, MarkdownModuleConfig, MarkedOptions } from 'ngx-markdown';

import { environment } from '../environments/environment';
import { AppDocMarkdownReferenceComponent } from './componenets/md-reference/md-reference.component';
import { AppDocMarkdownReferenceTreeComponent } from './componenets/md-reference-tree/md-reference-tree.component';
import { AppDocRootComponent } from './componenets/root/root.component';
import { AppDocRoutingModule } from './doc-routing.module';
import { DOC_APP_ENV } from './interfaces/environment.interface';
import { AppMdFilesStoreModule } from './modules/md-files/md-files.module';

const markdownModuleConfig: MarkdownModuleConfig = {
  loader: HttpClient,
  markedOptions: {
    provide: MarkedOptions,
    useValue: {
      gfm: true,
      breaks: false,
      pedantic: false,
      smartLists: true,
      smartypants: false,
    },
  },
};

@NgModule({
  declarations: [AppDocRootComponent, AppDocMarkdownReferenceTreeComponent, AppDocMarkdownReferenceComponent],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    MarkdownModule.forRoot(markdownModuleConfig),
    AppMaterialModule.forRoot(),
    StoreModule.forRoot({}, { metaReducers: metaReducers(environment.production) }),
    AppMdFilesStoreModule.forRoot(),
    AppPwaOfflineModule,
    AppDocRoutingModule,
    AppRouterStoreModule.forRoot(),
  ],
  providers: [
    appBaseHrefProvider,
    pathLocationStrategyProvider,
    windowProvider,
    documentProvider,
    { provide: DOC_APP_ENV, useValue: { ...environment } },
  ],
  bootstrap: [AppDocRootComponent],
})
export class AppDocModule {}
