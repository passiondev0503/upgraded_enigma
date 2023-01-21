import { TestBed, TestModuleMetadata, waitForAsync } from '@angular/core/testing';
import { getTestBedConfig, newTestBedMetadata } from '@app/client-testing-unit';
import { Store, StoreModule } from '@ngrx/store';
import { first, tap } from 'rxjs';

import { diagnosticsActions } from './diagnostics.actions';
import { featureName, IDiagnosticsState, IDiagnosticsStateModel } from './diagnostics.interface';
import { AppDiagnosticsReducer } from './diagnostics.reducer';
import { diagnosticsSelectors } from './diagnostics.selectors';

describe('AppDiagnosticsReducer', () => {
  const testBedMetadata: TestModuleMetadata = newTestBedMetadata({
    imports: [StoreModule.forFeature<IDiagnosticsState>(featureName, AppDiagnosticsReducer.token)],
    providers: [AppDiagnosticsReducer.provider],
  });
  const testBedConfig: TestModuleMetadata = getTestBedConfig(testBedMetadata);

  let reducer: AppDiagnosticsReducer;
  let store: Store<IDiagnosticsState>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule(testBedConfig)
      .compileComponents()
      .then(() => {
        reducer = TestBed.inject(AppDiagnosticsReducer);
        store = TestBed.inject(Store);
      });
  }));

  it('should be defined', () => {
    expect(reducer).toBeDefined();
  });

  it('should have correct initial state', () => {
    const initialState = AppDiagnosticsReducer.initialState;
    const expectation: IDiagnosticsStateModel = { staticData: [], dynamicData: [] };
    expect(initialState).toEqual(expectation);
  });

  it('should process the staticDataSuccess action correctly', waitForAsync(() => {
    const payload = [{ message: 'test' }];
    store.dispatch(diagnosticsActions.staticDataSuccess({ payload }));
    void store
      .select(diagnosticsSelectors.staticData)
      .pipe(
        first(),
        tap(data => {
          expect(data).toEqual(payload);
        }),
      )
      .subscribe();
  }));
});
