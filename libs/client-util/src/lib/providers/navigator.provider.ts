import { InjectionToken, Provider } from '@angular/core';

export const NAVIGATOR = new InjectionToken<Navigator>('Navigator');

export function navigatorFactory() {
  return window.navigator;
}

export const navigatorProvider: Provider = {
  provide: NAVIGATOR,
  useFactory: navigatorFactory,
};
