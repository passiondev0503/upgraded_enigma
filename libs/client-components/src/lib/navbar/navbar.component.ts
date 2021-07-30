import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { AppUserState } from '@app/client-store';
import { IButton, IWebClientAppEnvironment, WEB_CLIENT_APP_ENV } from '@app/client-util';
import { Store } from '@ngxs/store';
import { map } from 'rxjs/operators';

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
      requiresAuth: true,
    },
  ];

  public readonly appName = this.env.appName;

  public readonly user$ = this.store.select(AppUserState.token).pipe(map(token => ({ userAuthenticated: Boolean(token) })));

  constructor(public readonly store: Store, @Inject(WEB_CLIENT_APP_ENV) private readonly env: IWebClientAppEnvironment) {}
}
