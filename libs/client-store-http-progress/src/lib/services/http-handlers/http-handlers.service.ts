import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HTTP_STATUS, IWebClientAppEnvironment, WEB_CLIENT_APP_ENV } from '@app/client-util';
import { Store } from '@ngrx/store';
import memo from 'memo-decorator';
import { MonoTypeOperatorFunction, Observable, of } from 'rxjs';
import { catchError, finalize, tap, timeout } from 'rxjs/operators';

import { httpProgressActions } from '../../http-progress.actions';
import { IHttpProgressState } from '../../http-progress.interface';
import { AppToasterService } from '../toaster/toaster.service';

/**
 * Handlers to work with http requests.
 */
@Injectable({
  providedIn: 'root',
})
export class AppHttpHandlersService {
  public readonly defaultHttpTimeout = 10000;

  constructor(
    private readonly store: Store<IHttpProgressState>,
    private readonly toaster: AppToasterService,
    private readonly router: Router,
    @Inject(WEB_CLIENT_APP_ENV) private readonly env: IWebClientAppEnvironment,
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
   * @returns an endpoint url
   */
  @memo()
  public getEndpoint(path: string): string {
    const endpoint = /^\/.*$/.test(path) ? path : `/${path}`;
    return `${this.env.api}${endpoint}`;
  }

  /**
   * Pipes an http response.
   * Attaches settings:
   * - timeout
   * - error handler
   * - progress indicator
   * @param observable input observable
   * @returns a piped observable
   */
  public pipeHttpResponse<T>(observable: Observable<T>) {
    this.store.dispatch(httpProgressActions.start({ payload: { mainView: true } }));
    return observable.pipe(
      timeout(this.defaultHttpTimeout),
      this.tapError<T>(),
      catchError(err => this.handleError(err)),
      finalize(() => {
        this.store.dispatch(httpProgressActions.stop({ payload: { mainView: true } }));
      }),
    );
  }

  /**
   * Check error status, and reset token if status is 401.
   * @param status error status
   */
  public checkErrorStatusAndRedirect(status: HTTP_STATUS): void {
    if (status === HTTP_STATUS.UNAUTHORIZED) {
      const message = 'Something went wrong during authorization or you are not authorized to see this content.';
      this.toaster.showToaster(message, 'error');
      void this.router.navigate([{ outlets: { primary: [''] } }]);
    }
  }

  /**
   * Gets an error message from an http error response.
   * @param error http error response
   * @returns an error message
   */
  public getErrorMessage(error: HttpErrorResponse): string {
    const message: string | undefined = error.message ? error.message : error.error;
    const result: string =
      typeof message !== 'undefined' ? message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return result;
  }

  /**
   * Handles error.
   * @param error error object
   * @returns an empty observable
   */
  public handleError(error: HttpErrorResponse): Observable<never> {
    const message = this.getErrorMessage(error);
    this.toaster.showToaster(message, 'error');
    return of();
  }

  /**
   * Taps errors.
   * @returns a monotype operator function
   */
  public tapError<T>(): MonoTypeOperatorFunction<T> {
    return tap({
      next: (): void => void 0,
      error: (error: HttpErrorResponse) => {
        this.checkErrorStatusAndRedirect(error.status);
      },
    });
  }
}
