import { HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed, TestModuleMetadata, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import {
  flushHttpRequests,
  getTestBedConfig,
  newTestBedMetadata,
  spyOnFunctions,
  TClassMemberFunctionSpiesObject,
} from '@app/client-testing-unit';
import { AppTranslateModule } from '@app/client-translate';
import { HTTP_STATUS, IWebClientAppEnvironment, WEB_CLIENT_APP_ENV } from '@app/client-util';
import { Store } from '@ngrx/store';
import { of, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

import { httpProgressActions } from '../../http-progress.actions';
import { AppHttpProgressStoreModule } from '../../http-progress.module';
import { AppToasterService, toasterServiceProvider } from '../toaster/toaster.service';
import { AppHttpHandlersService } from './http-handlers.service';

describe('AppHttpHandlersService', () => {
  const testBedMetadata: TestModuleMetadata = newTestBedMetadata({
    imports: [AppTranslateModule.forRoot(), AppHttpProgressStoreModule.forRoot()],
    providers: [toasterServiceProvider],
  });
  const testBedConfig: TestModuleMetadata = getTestBedConfig(testBedMetadata);

  let service: AppHttpHandlersService;
  let serviceSpies: TClassMemberFunctionSpiesObject<AppHttpHandlersService>;
  let httpTestingController: HttpTestingController;
  let toaster: AppToasterService;
  let showToasterSpy: jest.SpyInstance;
  let env: IWebClientAppEnvironment;
  let store: Store;
  let storeDispatchSpy: jest.SpyInstance;
  let router: Router;
  let routerNavigateSpy: jest.SpyInstance;

  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule(testBedConfig)
      .compileComponents()
      .then(() => {
        service = TestBed.inject(AppHttpHandlersService);
        serviceSpies = spyOnFunctions<AppHttpHandlersService>(service);
        toaster = TestBed.inject(AppToasterService);
        showToasterSpy = jest.spyOn(toaster, 'showToaster');
        httpTestingController = TestBed.inject(HttpTestingController);
        env = TestBed.inject(WEB_CLIENT_APP_ENV);
        store = TestBed.inject(Store);
        storeDispatchSpy = jest.spyOn(store, 'dispatch');
        router = TestBed.inject(Router);
        routerNavigateSpy = jest.spyOn(router, 'navigate').mockImplementation(
          () =>
            new Promise<boolean>(resolve => {
              resolve(true);
            }),
        );
      });
  }));

  afterEach(() => {
    flushHttpRequests(httpTestingController, true);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(toaster).toBeDefined();
  });

  it('should have variables and methods defined', () => {
    expect(service.defaultHttpTimeout).toEqual(expect.any(Number));
    expect(service.getEndpoint).toEqual(expect.any(Function));
    expect(service.checkErrorStatusAndRedirect).toEqual(expect.any(Function));
    expect(service.handleError).toEqual(expect.any(Function));
    expect(service.pipeHttpResponse).toEqual(expect.any(Function));
    expect(service.tapError).toEqual(expect.any(Function));
  });

  it('getEndpoint should return an API endpoint', () => {
    expect(service.getEndpoint('test')).toEqual(`${env.api}/test`);
    expect(service.getEndpoint('/test')).toEqual(`${env.api}/test`);
  });

  it('checkErrorStatusAndRedirect should reset user if error status is 401', () => {
    service.checkErrorStatusAndRedirect(HTTP_STATUS.BAD_REQUEST);
    expect(routerNavigateSpy).not.toHaveBeenCalled();
    expect(showToasterSpy).not.toHaveBeenCalledWith(expect.any(String), 'error');
    service.checkErrorStatusAndRedirect(HTTP_STATUS.UNAUTHORIZED);
    expect(routerNavigateSpy).toHaveBeenCalled();
    expect(showToasterSpy).toHaveBeenCalledWith(expect.any(String), 'error');
  });

  describe('handleError', () => {
    it('should handle errors properly #1', waitForAsync(() => {
      const errRes = new HttpErrorResponse({
        status: 400,
        statusText: 'error status text',
      });
      void service
        .handleError(errRes)
        .pipe(
          catchError((error: Error) => {
            expect(error).toEqual(new Error(service.getErrorMessage(errRes)));
            return of(null);
          }),
        )
        .subscribe();
    }));

    it('should handle errors properly #2', waitForAsync(() => {
      const errRes = new HttpErrorResponse({});
      void service
        .handleError(errRes)
        .pipe(
          catchError((error: Error) => {
            expect(error).toEqual(new Error(service.getErrorMessage(errRes)));
            return of(null);
          }),
        )
        .subscribe();
    }));
  });

  describe('getErrorMessage', () => {
    it('should process an error as expected if the message property is present', () => {
      const error = <HttpErrorResponse>{ message: 'test' };
      expect(service.getErrorMessage(error)).toEqual(error.message);
    });

    it('should process an error as expected if the error property is present', () => {
      const error = <HttpErrorResponse>{ error: 'test' };
      expect(service.getErrorMessage(error)).toEqual(error.error);
    });

    it('should process an error as expected if the status property is present', () => {
      const error = <HttpErrorResponse>{ status: 400, statusText: 'test' };
      expect(service.getErrorMessage(error)).toEqual(`${error.status} - ${error.statusText}`);
    });

    it('should process an error as expected if non of the expected properties are present', () => {
      const error = <HttpErrorResponse>{};
      expect(service.getErrorMessage(error)).toEqual('Server error');
    });
  });

  describe('pipeHttpResponse', () => {
    it('should pipe observables that return data correctly', waitForAsync(() => {
      const observable = of({ data: {} });
      void service
        .pipeHttpResponse(observable)
        .pipe(
          tap(() => {
            expect(serviceSpies.handleError).not.toHaveBeenCalled();
            expect(storeDispatchSpy).toHaveBeenCalledWith(httpProgressActions.start({ payload: { mainView: true } }));
          }),
          finalize(() => {
            expect(storeDispatchSpy).toHaveBeenCalledWith(httpProgressActions.stop({ payload: { mainView: true } }));
          }),
        )
        .subscribe();
    }));

    it('should pipe observables that throw errors correctly', waitForAsync(() => {
      const error = new Error('');
      const observable = throwError(() => error);
      void service
        .pipeHttpResponse(observable)
        .pipe(
          tap(() => {
            expect(serviceSpies.handleError).toHaveBeenCalledWith(error, true);
            expect(storeDispatchSpy).toHaveBeenCalledWith(httpProgressActions.start({ payload: { mainView: true } }));
          }),
        )
        .subscribe();
    }));
  });
});
