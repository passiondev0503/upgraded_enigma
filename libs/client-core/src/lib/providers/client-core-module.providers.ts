import { Provider } from '@angular/core';
import { appBaseHrefProvider, documentProvider, navigatorProvider, pathLocationStrategyProvider, windowProvider } from '@app/client-util';

/**
 * Shared core module providers.
 */
export const appClientCoreModuleProviders: Provider[] = [
  pathLocationStrategyProvider,
  appBaseHrefProvider,
  windowProvider,
  documentProvider,
  navigatorProvider,
];
