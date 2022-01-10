import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AppUserState, userActions } from '@app/client-store';
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
      routeActive: () =>
        this.router.isActive('', {
          matrixParams: 'ignored',
          queryParams: 'ignored',
          paths: 'exact',
          fragment: 'ignored',
        }),
      icon: 'home',
      title: 'Home',
      requiresAuth: false,
    },
    {
      routerLink: ['user/auth'],
      routeActive: () =>
        this.router.isActive('user/auth', {
          matrixParams: 'ignored',
          queryParams: 'ignored',
          paths: 'exact',
          fragment: 'ignored',
        }),
      icon: 'input',
      title: 'Log in',
      requiresAuth: false,
    },
    {
      routerLink: [''],
      routeActive: () => false,
      icon: 'lock',
      title: 'Log out',
      requiresAuth: true,
      click: () => {
        void this.store.dispatch(new userActions.logOut()).subscribe();
      },
    },
    {
      routerLink: ['user'],
      routeActive: () =>
        this.router.isActive('user', {
          matrixParams: 'ignored',
          queryParams: 'ignored',
          paths: 'exact',
          fragment: 'ignored',
        }),
      icon: 'verified_user',
      title: 'User profile',
      requiresAuth: true,
    },
    {
      routerLink: ['user/data'],
      routeActive: () =>
        this.router.isActive('user/data', {
          matrixParams: 'ignored',
          queryParams: 'ignored',
          paths: 'exact',
          fragment: 'ignored',
        }),
      icon: 'dashboard',
      title: 'User data',
      requiresAuth: true,
    },
    {
      routerLink: ['user/rtc-chat'],
      routeActive: () =>
        this.router.isActive('user/rtc-chat', {
          matrixParams: 'ignored',
          queryParams: 'ignored',
          paths: 'exact',
          fragment: 'ignored',
        }),
      icon: 'voice_chat',
      title: 'RTC Chat',
      requiresAuth: true,
    },
    {
      routerLink: ['workspaces'],
      routeActive: () =>
        this.router.isActive('workspaces', {
          matrixParams: 'ignored',
          queryParams: 'ignored',
          paths: 'exact',
          fragment: 'ignored',
        }),
      icon: 'view_comfy',
      title: 'Workspaces',
      requiresAuth: true,
    },
    {
      routerLink: ['chatbot'],
      routeActive: () =>
        this.router.isActive('chatbot', {
          matrixParams: 'ignored',
          queryParams: 'ignored',
          paths: 'exact',
          fragment: 'ignored',
        }),
      icon: 'chat',
      title: 'Chat',
      requiresAuth: true,
    },
    {
      routerLink: ['info'],
      routeActive: () =>
        this.router.isActive('info', {
          matrixParams: 'ignored',
          queryParams: 'ignored',
          paths: 'exact',
          fragment: 'ignored',
        }),
      icon: 'av_timer',
      title: 'Diagnostics',
      requiresAuth: true,
    },
  ];

  public readonly appName = this.env.appName;

  public readonly user$ = this.store.select(AppUserState.token).pipe(map(token => ({ userAuthenticated: Boolean(token) })));

  constructor(
    public readonly store: Store,
    private readonly router: Router,
    @Inject(WEB_CLIENT_APP_ENV) private readonly env: IWebClientAppEnvironment,
  ) {}
}
