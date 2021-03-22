import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { AppDiagnosticsState } from './diagnostics.store';

@NgModule({
  imports: [NgxsModule.forFeature([AppDiagnosticsState])],
})
export class AppDiagnosticsModule {}
