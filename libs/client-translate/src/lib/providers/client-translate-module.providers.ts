import { Provider } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { EN, EN_DICTIONARY } from '../dictionaries/en';
import { RU, RU_DICTIONARY } from '../dictionaries/ru';

/**
 * Module providers.
 */
export const appSharedUiTranslateModuleProviders: Provider[] = [
  TranslateService,
  TranslatePipe,
  { provide: RU_DICTIONARY, useValue: RU },
  { provide: EN_DICTIONARY, useValue: EN },
];
