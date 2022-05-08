import { Provider } from '@angular/core';
import {
  appBaseHrefProvider,
  documentProvider,
  environmentProvider,
  IWebClientAppEnvironment,
  navigatorProvider,
  pathLocationStrategyProvider,
  windowProvider,
} from '@app/client-util';

/**
 * Client core module providers.
 */
export const appClientCoreModuleProvidersFactory = (environment: IWebClientAppEnvironment): Provider[] => [
  pathLocationStrategyProvider,
  appBaseHrefProvider,
  windowProvider,
  documentProvider,
  navigatorProvider,
  environmentProvider(environment),
];
