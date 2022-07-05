import { MatTooltipDefaultOptions } from '@angular/material/tooltip';

export function matTooltipOptionsFactory(): MatTooltipDefaultOptions {
  return {
    showDelay: 100,
    hideDelay: 100,
    touchendHideDelay: 1000,
  };
}
