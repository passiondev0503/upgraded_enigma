import { Pipe, PipeTransform } from '@angular/core';
import { IToolbarButton } from '@app/client-util';

@Pipe({
  name: 'buttonsVisibility',
})
export class AppButtonsVisibilityPipe implements PipeTransform {
  public transform(value?: IToolbarButton[], userAuthenticated?: boolean) {
    if (typeof value === 'undefined') {
      return null;
    }
    if (typeof userAuthenticated === 'undefined') {
      return value;
    }

    return value.filter(button => userAuthenticated === button.requiresAuth);
  }
}
