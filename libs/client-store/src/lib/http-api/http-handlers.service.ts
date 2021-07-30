import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApolloLink, split } from '@apollo/client/core';
import { ErrorResponse, onError } from '@apollo/client/link/error';
import { getMainDefinition } from '@apollo/client/utilities';
import { HTTP_STATUS, IWebClientAppEnvironment, WEB_CLIENT_APP_ENV, WINDOW } from '@app/client-util';
import { TranslateService } from '@ngx-translate/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { HttpLink, HttpLinkHandler } from 'apollo-angular/http';
import { createUploadLink } from 'apollo-upload-client';
import { ExecutionResult, GraphQLError } from 'graphql';
import memo from 'memo-decorator';
import { MonoTypeOperatorFunction, Observable, of, throwError } from 'rxjs';
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
    public readonly httpLink: HttpLink,
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
   * Gql endpoint former.
   */
  public graphQlEndpoint(): string {
    return `${this.env.api}/graphql`;
  }

  /**
   * Returns new http headers for GraphQL.
   */
  public getGraphQLHttpHeaders() {
    const token = this.getUserToken();
    return new HttpHeaders({
      Authorization: `Token ${token}`,
    });
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
   * Pipes graphQL request response.
   * Attaches settings:
   * - timeout
   * - error handler
   * - progress indicator
   */
  public pipeGraphQLRequest<T>(observable: Observable<T>, withprogress = true) {
    if (withprogress) {
      void this.store.dispatch(new httpProgressActions.startProgress({ mainView: true }));
    }
    return observable.pipe(
      timeout(this.defaultHttpTimeout),
      this.tapError<T>(),
      catchError(err => this.handleGraphQLError(err)),
      finalize(() => {
        if (withprogress) {
          void this.store.dispatch(new httpProgressActions.stopProgress({ mainView: true }));
        }
      }),
    );
  }

  private getGraphqlNetworkLink(httpLinkHandler: HttpLinkHandler, uri: string) {
    const token = this.getUserToken();
    return split(
      ({ query }) => {
        const { name } = getMainDefinition(query);
        return !name;
      },
      httpLinkHandler,
      createUploadLink({
        uri,
        headers: { Authorization: `Token ${token}` },
      }) as unknown as ApolloLink,
    );
  }

  private getErroLinkHandler(errorLinkHandler?: ApolloLink) {
    const linkHandler =
      typeof errorLinkHandler !== 'undefined'
        ? errorLinkHandler
        : onError((error: ErrorResponse) => {
            let resultMessage = '';
            /**
             * Error code in uppercase, e.g. ACCESS_FORBIDDEN.
             * Should be used as a translate service dictionary key
             * to retrieve a localized substring for UI display.
             * Only last error code is translated and displayed in UI.
             */
            let errorCode = '';
            let errorCodeUITranslation = '';

            const { graphQLErrors, networkError } = error;

            if (typeof graphQLErrors !== 'undefined') {
              console.error('Apollo linkHandler [GraphQL error]: ', graphQLErrors);
              graphQLErrors.map(({ message, extensions }) => {
                resultMessage += `[GraphQL]: ${message}`;
                errorCode = extensions?.code;
              });
            }

            if (networkError) {
              console.error('Apollo linkHandler [Network error]: ', networkError);

              if (networkError instanceof HttpErrorResponse) {
                resultMessage += (networkError.error as { detail: string }).detail;
              } else {
                const errors: GraphQLError[] = (
                  networkError as unknown as {
                    error: {
                      errors: GraphQLError[];
                    };
                  }
                ).error.errors;
                errors.map(({ message, extensions }) => {
                  resultMessage += `[Network]: ${message}`;
                  errorCode = extensions?.code;
                });
              }
            }

            if (errorCode) {
              errorCodeUITranslation = this.translate.instant(`request.error.${errorCode}`);
              if (!errorCodeUITranslation.includes(errorCode)) {
                resultMessage = errorCodeUITranslation;
              }
            }

            resultMessage = !resultMessage ? 'Graphql request error' : resultMessage;

            this.toaster.showToaster(resultMessage, 'error');
          });
    return linkHandler;
  }

  /**
   * Creates apollo link with error handler.
   * @param errorLinkHandler custom error handler
   */
  public createApolloLinkFor(errorLinkHandler?: ApolloLink) {
    const uri = this.graphQlEndpoint();
    const httpLinkHandler = this.httpLink.create({ uri });
    const linkHandler: ApolloLink = this.getErroLinkHandler(errorLinkHandler);
    const networkLink = this.getGraphqlNetworkLink(httpLinkHandler, uri);
    return linkHandler.concat(networkLink);
  }

  /**
   * Extracts GraphQL data.
   * Returns data only, excluding meta information located in response object root.
   * @param res Execution result
   */
  public extractGraphQLData(res: ExecutionResult): Observable<{ [key: string]: unknown }> {
    if (typeof res.errors !== 'undefined') {
      return throwError(() => new Error(res.errors?.join(', ')));
    }
    return of(res.data ?? res);
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
   * Handles graphQL error response.
   * @param error error message
   */
  public handleGraphQLError(error: string): Observable<never> {
    return throwError(() => new Error(error));
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
