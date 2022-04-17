import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { sidebarActions, userActions } from '@app/client-store';
import { IToolbarButton, IWebClientAppEnvironment, WEB_CLIENT_APP_ENV } from '@app/client-util';
import { RouterState } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { first, tap } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppNavbarComponent {
  @Input() public logoSrc = 'assets/upgraded-enigma.png';

  @Input() public showBackButton = false;

  @Input() public auth: { authenticated: boolean } = { authenticated: false };

  @Input() public buttons: IToolbarButton[] = [
    {
      routerLink: [{ outlets: { primary: [''], sidebar: [] } }],
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
      routerLink: [{ outlets: { primary: ['user', 'auth'], sidebar: [] } }],
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
      routerLink: [{ outlets: { primary: [''], sidebar: [] } }],
      routeActive: () => false,
      icon: 'lock',
      title: 'Log out',
      requiresAuth: true,
      click: () => {
        void this.store.dispatch(new userActions.logOut()).subscribe();
      },
    },
    {
      routerLink: [{ outlets: { primary: ['user'], sidebar: [] } }],
      routeActive: () =>
        this.router.isActive('user', {
          matrixParams: 'ignored',
          queryParams: 'ignored',
          paths: 'exact',
          fragment: 'ignored',
        }),
      icon: 'verified_user',
      title: 'User',
      requiresAuth: true,
    },
    {
      routerLink: [{ outlets: { primary: ['user', 'data'], sidebar: [] } }],
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
      routerLink: [{ outlets: { primary: ['user', 'rtc-chat'], sidebar: [] } }],
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
      routerLink: [{ outlets: { primary: ['workspaces'], sidebar: [] } }],
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
      routerLink: [{ outlets: { primary: ['chatbot'], sidebar: [] } }],
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
      routerLink: [{ outlets: { primary: ['info'], sidebar: [] } }],
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

  /**
   * This stream is needed to trigger the change detection when the router state changes.
   */
  public readonly routerEvents$ = this.router.events;

  constructor(
    public readonly store: Store,
    private readonly router: Router,
    private readonly location: Location,
    @Inject(WEB_CLIENT_APP_ENV) private readonly env: IWebClientAppEnvironment,
  ) {}

  public sidebarCloseHandler(): void {
    void this.store.dispatch(new sidebarActions.setState({ sidebarOpened: false }));
  }

  public goBack(): void {
    void this.store
      .select(RouterState.state)
      .pipe(
        first(),
        tap(state => {
          const hasQueryParams = state?.url?.match(/.*[?].*/);
          if (typeof hasQueryParams !== 'undefined' && hasQueryParams !== null && hasQueryParams.length > 0) {
            this.location.back(); // first call resets query params only
            this.location.back();
          } else {
            this.location.back();
          }
        }),
      )
      .subscribe();
  }
}
