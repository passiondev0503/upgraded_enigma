import { TestBed, TestModuleMetadata, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { getTestBedConfig, newTestBedMetadata } from '@app/client-testing-unit';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { AppUserApiService } from './services/user-api.service';
import { userActions } from './user.actions';
import { AppUserEffects } from './user.effects';
import { featureName, IUserState } from './user.interface';
import { AppUserReducer } from './user.reducer';

describe('AppUserEffects', () => {
  const testBedMetadata: TestModuleMetadata = newTestBedMetadata({
    imports: [
      StoreModule.forFeature<IUserState>(featureName, AppUserReducer.token),
      EffectsModule.forFeature([AppUserEffects]),
      TranslateModule.forRoot(),
    ],
    providers: [
      AppUserReducer.provider,
      {
        provide: AppUserApiService,
        useValue: {
          login: () => of(null),
          logout: () => of(null),
          getUser: () => of({ ...AppUserReducer.initialState }),
          getUserStatus: () => of({ ...AppUserReducer.initialState.status }),
        },
      },
    ],
  });
  const testBedConfig: TestModuleMetadata = getTestBedConfig(testBedMetadata);

  let store: Store<IUserState>;
  let router: Router;
  let routerNavigateSpy: jest.SpyInstance;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule(testBedConfig)
      .compileComponents()
      .then(() => {
        store = TestBed.inject(Store);
        router = TestBed.inject(Router);
        routerNavigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => new Promise<boolean>(resolve => resolve(true)));
      });
  }));

  it('should call router.navigate when the login action is dispatched', waitForAsync(() => {
    store.dispatch(userActions.login({ payload: { email: 'test@test.test', password: 'pass' } }));
    expect(routerNavigateSpy).toHaveBeenCalledWith([{ outlets: { primary: ['user'] } }]);
  }));

  it('should call router.navigate when the logout action is dispatched', waitForAsync(() => {
    store.dispatch(userActions.logout());
    expect(routerNavigateSpy).toHaveBeenCalledWith([{ outlets: { primary: [''] } }]);
  }));
});
