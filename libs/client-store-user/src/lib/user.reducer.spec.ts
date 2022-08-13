import { TestBed, TestModuleMetadata, waitForAsync } from '@angular/core/testing';
import { getTestBedConfig, newTestBedMetadata } from '@app/client-unit-testing';
import { Store, StoreModule } from '@ngrx/store';
import { first, tap } from 'rxjs';

import { userActions } from './user.actions';
import { featureName, ILoginPayload, IUserState, IUserStateModel } from './user.interface';
import { AppUserReducer } from './user.reducer';
import { userSelectors } from './user.selectors';

describe('AppUserReducer', () => {
  const testBedMetadata: TestModuleMetadata = newTestBedMetadata({
    imports: [StoreModule.forFeature<IUserState>(featureName, AppUserReducer.token)],
    providers: [AppUserReducer.provider],
  });
  const testBedConfig: TestModuleMetadata = getTestBedConfig(testBedMetadata);

  let reducer: AppUserReducer;
  let store: Store<IUserState>;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule(testBedConfig)
      .compileComponents()
      .then(() => {
        reducer = TestBed.inject(AppUserReducer);
        store = TestBed.inject(Store);
      });
  }));

  it('should be defined', () => {
    expect(reducer).toBeDefined();
  });

  it('should have correct initial state', () => {
    const initialState = AppUserReducer.initialState;
    const expectation: IUserStateModel = {
      email: void 0,
      token: void 0,
      passwords: [],
      status: {
        initialized: false,
        encryption: false,
        encrypted: false,
      },
      exportedPasswordFiles: [],
    };
    expect(initialState).toEqual(expectation);
  });

  it('should process the login action correctly', waitForAsync(() => {
    const payload: ILoginPayload = { email: 'test@test.test', password: '' };
    store.dispatch(userActions.login({ payload }));
    void store
      .select(userSelectors.email)
      .pipe(
        first(),
        tap(email => {
          expect(email).toEqual(payload.email);
        }),
      )
      .subscribe();
  }));

  it('should process the logout action correctly', waitForAsync(() => {
    const payload: ILoginPayload = { email: 'test@test.test', password: '' };
    store.dispatch(userActions.login({ payload }));
    store.dispatch(userActions.logout());
    void store
      .select(userSelectors.email)
      .pipe(
        first(),
        tap(email => {
          expect(email).toEqual(payload.email);
        }),
      )
      .subscribe();
  }));

  it('should process the configureUser action correctly', waitForAsync(() => {
    const payload = { email: 'test@test.test' };
    store.dispatch(userActions.setState({ payload }));
    void store
      .select(userSelectors.email)
      .pipe(
        first(),
        tap(email => {
          expect(email).toEqual(payload.email);
        }),
      )
      .subscribe();
  }));

  it('should process the resetState action correctly', waitForAsync(() => {
    const payload = { email: 'test@test.test' };
    store.dispatch(userActions.setState({ payload }));
    store.dispatch(userActions.resetState());
    void store
      .select(userSelectors.email)
      .pipe(
        first(),
        tap(email => {
          expect(email).toEqual(payload.email);
        }),
      )
      .subscribe();
  }));
});
