import { TestBed, TestModuleMetadata, waitForAsync } from '@angular/core/testing';
import { getTestBedConfig, newTestBedMetadata } from '@app/client-unit-testing';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { first, of, tap } from 'rxjs';

import { diagnosticsActions } from './diagnostics.actions';
import { AppDiagnosticsEffects } from './diagnostics.effects';
import { featureName, IDiagnosticsState, TDiagnosticsDataResponse } from './diagnostics.interface';
import { AppDiagnosticsReducer } from './diagnostics.reducer';
import { diagnosticsSelectors } from './diagnostics.selectors';
import { AppServerStaticDataService } from './services/server-static-data-api.service';

describe('AppDiagnosticsEffects', () => {
  const testBedMetadata: TestModuleMetadata = newTestBedMetadata({
    imports: [
      StoreModule.forFeature<IDiagnosticsState>(featureName, AppDiagnosticsReducer.token),
      EffectsModule.forFeature([AppDiagnosticsEffects]),
    ],
    providers: [
      AppDiagnosticsReducer.provider,
      {
        provide: AppServerStaticDataService,
        useValue: {
          staticData: () => of(<TDiagnosticsDataResponse>[{ message: 'test' }]),
        },
      },
    ],
  });
  const testBedConfig: TestModuleMetadata = getTestBedConfig(testBedMetadata);

  let store: Store<IDiagnosticsState>;
  let service: AppServerStaticDataService;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule(testBedConfig)
      .compileComponents()
      .then(() => {
        store = TestBed.inject(Store);
        service = TestBed.inject(AppServerStaticDataService);
      });
  }));

  it('should call http api service when the ping action is dispatched', waitForAsync(() => {
    const response: TDiagnosticsDataResponse = [{ message: 'test' }];
    const staticDataSpy = jest.spyOn(service, 'staticData').mockReturnValue(of(response));
    store.dispatch(diagnosticsActions.staticData());
    void store
      .select(diagnosticsSelectors.staticData)
      .pipe(
        first(),
        tap(data => {
          expect(staticDataSpy).toHaveBeenCalledTimes(1);
          expect(data).toEqual(response);
        }),
      )
      .subscribe();
  }));
});
