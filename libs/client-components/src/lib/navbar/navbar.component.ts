import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import {
  IButton,
  IWebClientAppEnvironment,
  WEB_CLIENT_APP_ENV,
} from '@upgraded-enigma/client-util';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppNavbarComponent {
  @Input() public logoSrc = 'assets/icons/icon-72x72.png';

  @Input() public buttons: IButton[] = [
    {
      routerLink: [''],
      icon: 'home',
      title: 'Home',
      requiresAuth: false,
    },
    {
      routerLink: ['info'],
      icon: 'av_timer',
      title: 'Diagnostics',
      requiresAuth: false,
    },
  ];

  public readonly appName = this.env.appName;

  constructor(@Inject(WEB_CLIENT_APP_ENV) private readonly env: IWebClientAppEnvironment) {}
}
