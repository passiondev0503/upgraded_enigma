import { ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AppDiagnosticsEffects } from './diagnostics.effects';
import { featureName, IDiagnosticsState } from './diagnostics.interface';
import { AppDiagnosticsReducer } from './diagnostics.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature<IDiagnosticsState>(featureName, AppDiagnosticsReducer.token),
    EffectsModule.forFeature([AppDiagnosticsEffects]),
  ],
})
export class AppDiagnosticsStoreModule {
  public static forRoot(): ModuleWithProviders<AppDiagnosticsStoreModule> {
    return {
      ngModule: AppDiagnosticsStoreModule,
      providers: [AppDiagnosticsReducer.provider],
    };
  }
}
