import { Location } from '@angular/common';
import { ComponentFixture, TestBed, TestModuleMetadata, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AppPipesModule } from '@app/client-pipes';
import { AppSidebarStoreModule, sidebarActions } from '@app/client-store-sidebar';
import { getTestBedConfig, newTestBedMetadata } from '@app/client-testing-unit';
import { IWebClientAppEnvironment, WEB_CLIENT_APP_ENV } from '@app/client-util';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { AppNavbarComponent } from './navbar.component';

describe('AppNavbarComponent', () => {
  const testBedMetadata: TestModuleMetadata = newTestBedMetadata({
    imports: [AppSidebarStoreModule.forRoot(), AppPipesModule],
    declarations: [AppNavbarComponent],
  });
  const testBedConfig: TestModuleMetadata = getTestBedConfig(testBedMetadata);

  let fixture: ComponentFixture<AppNavbarComponent>;
  let component: AppNavbarComponent;
  let env: IWebClientAppEnvironment;
  let store: Store;
  let storeSpy: {
    select: jest.SpyInstance;
    dispatch: jest.SpyInstance;
  };
  let loc: Location;
  let router: Router;
  let routerIsActiveSpy: jest.SpyInstance;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule(testBedConfig)
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AppNavbarComponent);
        component = fixture.debugElement.componentInstance;

        store = TestBed.inject(Store);
        storeSpy = {
          select: jest.spyOn(store, 'select'),
          dispatch: jest.spyOn(store, 'dispatch').mockImplementation((action: unknown) => of(null)),
        };

        env = TestBed.inject(WEB_CLIENT_APP_ENV);

        loc = TestBed.inject(Location);

        router = TestBed.inject(Router);
        routerIsActiveSpy = jest.spyOn(router, 'isActive');

        fixture.detectChanges();
      });
  }));

  it('should be defined', () => {
    expect(component).toBeDefined();
  });

  it('appName should be equal to the app name in the environment object', () => {
    expect(component.appName).toEqual(env.appName);
  });

  it('sidebarCloseHandler should call store dispatch', waitForAsync(() => {
    component.sidebarCloseHandler();
    expect(storeSpy.dispatch).toHaveBeenCalledWith(sidebarActions.close({ payload: { navigate: false } }));
  }));

  it('goBack should call store dispatch and location.back', () => {
    const locationBackSpy = jest.spyOn(loc, 'back');
    component.goBack();
    expect(locationBackSpy).toHaveBeenCalled();
  });

  it('buttons should have default values', () => {
    const expectedLength = 9;
    expect(component.buttons.length).toEqual(expectedLength);
  });

  it('buttons, routeActive should call router isActive with params', () => {
    const firstButtonIndex = 0;
    component.buttons[firstButtonIndex].routeActive();
    expect(routerIsActiveSpy).toHaveBeenCalledWith('', {
      matrixParams: 'ignored',
      queryParams: 'ignored',
      paths: 'exact',
      fragment: 'ignored',
    });
    routerIsActiveSpy.mockClear();

    const secondButtonIndex = 1;
    component.buttons[secondButtonIndex].routeActive();
    expect(routerIsActiveSpy).toHaveBeenCalledWith('user/auth', {
      matrixParams: 'ignored',
      queryParams: 'ignored',
      paths: 'exact',
      fragment: 'ignored',
    });
    routerIsActiveSpy.mockClear();

    const thirdButtonIndex = 2;
    component.buttons[thirdButtonIndex].routeActive();
    expect(routerIsActiveSpy).not.toHaveBeenCalledWith();
    routerIsActiveSpy.mockClear();

    const fourthButtonIndex = 3;
    component.buttons[fourthButtonIndex].routeActive();
    expect(routerIsActiveSpy).toHaveBeenCalledWith('user', {
      matrixParams: 'ignored',
      queryParams: 'ignored',
      paths: 'exact',
      fragment: 'ignored',
    });
    routerIsActiveSpy.mockClear();

    const fifthButtonIndex = 4;
    component.buttons[fifthButtonIndex].routeActive();
    expect(routerIsActiveSpy).toHaveBeenCalledWith('user/data', {
      matrixParams: 'ignored',
      queryParams: 'ignored',
      paths: 'exact',
      fragment: 'ignored',
    });
    routerIsActiveSpy.mockClear();

    const seventhButtonIndex = 5;
    component.buttons[seventhButtonIndex].routeActive();
    expect(routerIsActiveSpy).toHaveBeenCalledWith('workspaces', {
      matrixParams: 'ignored',
      queryParams: 'ignored',
      paths: 'exact',
      fragment: 'ignored',
    });
    routerIsActiveSpy.mockClear();

    const sixthButtonIndex = 6;
    component.buttons[sixthButtonIndex].routeActive();
    expect(routerIsActiveSpy).toHaveBeenCalledWith('user/rtc-chat', {
      matrixParams: 'ignored',
      queryParams: 'ignored',
      paths: 'exact',
      fragment: 'ignored',
    });
    routerIsActiveSpy.mockClear();

    const eightthButtonIndex = 7;
    component.buttons[eightthButtonIndex].routeActive();
    expect(routerIsActiveSpy).toHaveBeenCalledWith('chatbot', {
      matrixParams: 'ignored',
      queryParams: 'ignored',
      paths: 'exact',
      fragment: 'ignored',
    });
    routerIsActiveSpy.mockClear();

    const ninethButtonIndex = 8;
    component.buttons[ninethButtonIndex].routeActive();
    expect(routerIsActiveSpy).toHaveBeenCalledWith('info', {
      matrixParams: 'ignored',
      queryParams: 'ignored',
      paths: 'exact',
      fragment: 'ignored',
    });
    routerIsActiveSpy.mockClear();
  });
});
