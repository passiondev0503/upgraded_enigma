import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed, TestModuleMetadata, waitForAsync } from '@angular/core/testing';
import { AppClientTranslateModule } from '@app/client-translate';
import {
  AppLocalStorageMock,
  getTestBedConfig,
  newTestBedMetadata,
  spyOnFunctions,
  TClassMemberFunctionSpiesObject,
} from '@app/client-unit-testing';
import { HTTP_STATUS } from '@app/client-util';
import { Store } from '@ngxs/store';
import { of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { httpProgressActions } from '../http-progress/http-progress.actions';
import { AppHttpProgressStoreModule } from '../http-progress/http-progress.module';
import { AppToasterService, toasterServiceProvider } from '../http-progress/services/toaster/toaster.service';
import { AppHttpHandlersService } from './http-handlers.service';

describe('AppHttpHandlersService', () => {
  const testBedMetadata: TestModuleMetadata = newTestBedMetadata({
    imports: [AppClientTranslateModule.forRoot(), AppHttpProgressStoreModule.forRoot()],
    providers: [toasterServiceProvider],
  });
  const testBedConfig: TestModuleMetadata = getTestBedConfig(testBedMetadata);

  let service: AppHttpHandlersService;
  let serviceSpies: TClassMemberFunctionSpiesObject<AppHttpHandlersService>;
  let httpTestingController: HttpTestingController;
  let localStorage: AppLocalStorageMock;
  let toaster: AppToasterService;
  let store: Store;
  let storeDispatchSpy: jest.SpyInstance;

  beforeEach(waitForAsync(() => {
    localStorage = window.localStorage;
    jest.spyOn(localStorage, 'setItem');

    void TestBed.configureTestingModule(testBedConfig)
      .compileComponents()
      .then(() => {
        service = TestBed.inject(AppHttpHandlersService);
        serviceSpies = spyOnFunctions<AppHttpHandlersService>(service);
        toaster = TestBed.inject(AppToasterService);
        httpTestingController = TestBed.inject(HttpTestingController);
        store = TestBed.inject(Store);
        storeDispatchSpy = jest.spyOn(store, 'dispatch');
      });
  }));

  afterEach(() => {
    httpTestingController
      .match((req: HttpRequest<unknown>): boolean => true)
      .forEach((req: TestRequest) => (!req.cancelled ? req.flush({}) : null));
    httpTestingController.verify();
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

  it('checkErrorStatusAndRedirect should reset user if error status is 401', () => {
    service.checkErrorStatusAndRedirect(HTTP_STATUS.BAD_REQUEST);
    expect(storeDispatchSpy).not.toHaveBeenCalled();
    service.checkErrorStatusAndRedirect(HTTP_STATUS.UNAUTHORIZED);
    expect(storeDispatchSpy).toHaveBeenCalled();
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

  describe('pipeHttpResponse', () => {
    it('should pipe observable that returns data correctly', waitForAsync(() => {
      const observable = of({ data: {} });
      void service
        .pipeHttpResponse(observable)
        .pipe(
          tap(() => {
            expect(serviceSpies.handleError).not.toHaveBeenCalled();
            expect(storeDispatchSpy).toHaveBeenCalledWith(new httpProgressActions.stopProgress({ mainView: true }));
          }),
        )
        .subscribe();
    }));

    it('should pipe observable that throws an error correctly', waitForAsync(() => {
      const error = new Error('');
      const observable = throwError(() => error);
      void service
        .pipeHttpResponse(observable)
        .pipe(
          tap(() => {
            expect(serviceSpies.handleError).toHaveBeenCalledWith(error, true);
            expect(storeDispatchSpy).toHaveBeenCalledWith(new httpProgressActions.stopProgress({ mainView: true }));
          }),
        )
        .subscribe();
    }));
  });
});
