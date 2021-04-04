import { Pipe, PipeTransform } from '@angular/core';
import { IButton } from '@upgraded-enigma/client-util';

@Pipe({
  name: 'buttonsVisibility',
})
export class AppButtonsVisibilityPipe implements PipeTransform {
  public transform(value?: IButton[], userAuthenticated?: boolean) {
    if (typeof value === 'undefined') {
      return null;
    }
    if (typeof userAuthenticated === 'undefined') {
      return value;
    }

    return value.filter(button => userAuthenticated === button.requiresAuth);
  }
}
