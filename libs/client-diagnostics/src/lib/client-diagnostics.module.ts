import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppClientMaterialModule } from '@app/client-material';
import { AppClientTranslateModule } from '@app/client-translate';

import { AppClientDiagnosticsRoutingModule } from './client-diagnostics-routing.module';
import { AppHomeComponent } from './components/home/home.component';
import { AppHomePage } from './components/home/page/home-page.component';
import { AppIndexComponent } from './components/index/index.component';
import { AppInfoComponent } from './components/info/info.component';
import { AppInfoPage } from './components/info/page/info-page.component';

@NgModule({
  imports: [FlexLayoutModule, CommonModule, AppClientMaterialModule, AppClientTranslateModule, AppClientDiagnosticsRoutingModule],
  declarations: [AppIndexComponent, AppHomeComponent, AppHomePage, AppInfoComponent, AppInfoPage],
})
export class AppClientDiagnosticsModule {}
