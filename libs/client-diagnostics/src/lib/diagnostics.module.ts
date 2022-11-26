import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppMaterialModule } from '@app/client-material';
import { AppTranslateModule } from '@app/client-translate';

import { AppDiagnosticsHomeComponent } from './components/home/diagnostics-home.component';
import { AppDiagnosticsHomePage } from './components/home/page/diagnostics-home-page.component';
import { AppDiagnosticsIndexComponent } from './components/index/diagnostics-index.component';
import { AppDiagnosticsInfoComponent } from './components/info/diagnostics-info.component';
import { AppDiagnosticsInfoPage } from './components/info/page/diagnostics-info-page.component';
import { AppDiagnosticsRoutingModule } from './diagnostics-routing.module';

@NgModule({
  imports: [CommonModule, AppMaterialModule, AppTranslateModule, AppDiagnosticsRoutingModule],
  declarations: [
    AppDiagnosticsIndexComponent,
    AppDiagnosticsHomeComponent,
    AppDiagnosticsHomePage,
    AppDiagnosticsInfoComponent,
    AppDiagnosticsInfoPage,
  ],
})
export class AppDiagnosticsModule {}
