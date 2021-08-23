import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HTTP_STATUS, IWebClientAppEnvironment, WEB_CLIENT_APP_ENV, WINDOW } from '@app/client-util';
import { TranslateService } from '@ngx-translate/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import memo from 'memo-decorator';
import { MonoTypeOperatorFunction, Observable, throwError } from 'rxjs';
import { catchError, finalize, tap, timeout } from 'rxjs/operators';

import { httpProgressActions } from '../http-progress/http-progress.actions';
import { AppHttpProgressService } from '../http-progress/http-progress.service';
import { AppToasterService } from '../http-progress/services/toaster/toaster.service';
import { userActions } from '../user/user.actions';

/**
 * Handlers to work with http requests.
 */
@Injectable({
  providedIn: 'root',
})
export class AppHttpHandlersService {
  public readonly defaultHttpTimeout = 10000;

  constructor(
    public readonly store: Store,
    public readonly toaster: AppToasterService,
    public readonly httpProgress: AppHttpProgressService,
    public readonly translate: TranslateService,
    @Inject(WINDOW) public readonly win: Window,
    @Inject(WEB_CLIENT_APP_ENV) public readonly env: IWebClientAppEnvironment,
  ) {}

  public getUserToken() {
    const token: string = (
      JSON.parse(localStorage.getItem('userService') ?? JSON.stringify({ token: '' })) as {
        token: string;
      }
    ).token;
    return token;
  }

  /**
   * Returns API base url concatenated with provided endpoint path.
   * Adds preceding slash before endpoint path if it is missing.
   * @param path endpoint path
   */
  @memo()
  public getEndpoint(path: string): string {
    const endpoint = /^\/.*$/.test(path) ? path : `/${path}`;
    return `${this.env.api}${endpoint}`;
  }

  /**
   * Pipes http response.
   * Attaches settings:
   * - timeout
   * - error handler
   * - progress indicator
   */
  public pipeHttpResponse<T>(observable: Observable<T>) {
    void this.store.dispatch(new httpProgressActions.startProgress({ mainView: true }));
    return observable.pipe(
      timeout(this.defaultHttpTimeout),
      catchError(err => this.handleError(err)),
      finalize(() => {
        void this.store.dispatch(new httpProgressActions.stopProgress({ mainView: true }));
      }),
    );
  }

  /**
   * Extracts HttpResponse.
   * @param res Http response
   */
  public extractHttpResponse<T>(res: HttpResponse<T>) {
    return res.body;
  }

  /**
   * Check error status, and reset token if status is 401.
   * Note on errors:
   * 401 - unauthorized token expired
   * @param status error status
   */
  public checkErrorStatusAndRedirect(status: HTTP_STATUS): void {
    if (status === HTTP_STATUS.UNAUTHORIZED) {
      void this.store.dispatch(new userActions.setState({ token: '' }));
      void this.store.dispatch(new Navigate(['user/auth']));
    }
  }

  public getErrorMessage(error: HttpErrorResponse): string {
    const msg: string = error.message ? error.message : error.error;
    const errorMessage: string = msg ? msg : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return errorMessage;
  }

  /**
   * Handles error.
   * @param error error object
   */
  public handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = this.getErrorMessage(error);
    this.toaster.showToaster(errorMessage, 'error');
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Taps errors.
   */
  public tapError<T>(): MonoTypeOperatorFunction<T> {
    return tap(
      (): void => void 0,
      (error: { networkError: HttpErrorResponse }) => {
        const unauthorized: boolean = Boolean(error.networkError) && error.networkError.status === HTTP_STATUS.BAD_REQUEST;
        if (unauthorized) {
          this.checkErrorStatusAndRedirect(HTTP_STATUS.UNAUTHORIZED);
        }
      },
    );
  }
}
