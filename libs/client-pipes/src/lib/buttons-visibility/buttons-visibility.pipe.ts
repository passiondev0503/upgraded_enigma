import { Pipe, PipeTransform } from '@angular/core';
import { IRouterButton } from '@app/client-util';

@Pipe({
  name: 'buttonsVisibility',
})
export class AppButtonsVisibilityPipe implements PipeTransform {
  public transform(value?: IRouterButton[], userAuthenticated?: boolean) {
    if (typeof value === 'undefined') {
      return null;
    }
    if (typeof userAuthenticated === 'undefined') {
      return value;
    }

    return value.filter(button => userAuthenticated === button.requiresAuth);
  }
}
