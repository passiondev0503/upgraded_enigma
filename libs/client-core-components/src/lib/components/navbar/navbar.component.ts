import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { sidebarActions } from '@app/client-store-sidebar';
import { userActions } from '@app/client-store-user';
import { IRouterButton, IWebClientAppEnvironment, routerButton, WEB_CLIENT_APP_ENV } from '@app/client-util';
import { Store } from '@ngrx/store';

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

  @Input() public buttons: IRouterButton[] = [
    routerButton(
      'Home',
      'home',
      () =>
        this.router.isActive('', {
          matrixParams: 'ignored',
          queryParams: 'ignored',
          paths: 'exact',
          fragment: 'ignored',
        }),
      [{ outlets: { primary: [''], sidebar: [] } }],
      false,
    ),
    routerButton(
      'Log in',
      'input',
      () =>
        this.router.isActive('user/auth', {
          matrixParams: 'ignored',
          queryParams: 'ignored',
          paths: 'exact',
          fragment: 'ignored',
        }),
      [{ outlets: { primary: ['user', 'auth'], sidebar: [] } }],
      false,
    ),
    routerButton(
      'Log out',
      'lock',
      () => false,
      [{ outlets: { primary: [''], sidebar: [] } }],
      true,
      () => {
        this.store.dispatch(userActions.logout());
      },
    ),
    routerButton(
      'User',
      'verified_user',
      () =>
        this.router.isActive('user', {
          matrixParams: 'ignored',
          queryParams: 'ignored',
          paths: 'exact',
          fragment: 'ignored',
        }),
      [{ outlets: { primary: ['user'], sidebar: [] } }],
      true,
    ),
    routerButton(
      'User data',
      'dashboard',
      () =>
        this.router.isActive('user/data', {
          matrixParams: 'ignored',
          queryParams: 'ignored',
          paths: 'exact',
          fragment: 'ignored',
        }),
      [{ outlets: { primary: ['user', 'data'], sidebar: [] } }],
      true,
    ),
    routerButton(
      'Workspaces',
      'view_comfy',
      () =>
        this.router.isActive('workspaces', {
          matrixParams: 'ignored',
          queryParams: 'ignored',
          paths: 'exact',
          fragment: 'ignored',
        }),
      [{ outlets: { primary: ['workspaces'], sidebar: [] } }],
      true,
    ),
    routerButton(
      'RTC Chat',
      'voice_chat',
      () =>
        this.router.isActive('user/rtc-chat', {
          matrixParams: 'ignored',
          queryParams: 'ignored',
          paths: 'exact',
          fragment: 'ignored',
        }),
      [{ outlets: { primary: ['user', 'rtc-chat'], sidebar: [] } }],
      true,
    ),
    routerButton(
      'Chat',
      'chat',
      () =>
        this.router.isActive('chatbot', {
          matrixParams: 'ignored',
          queryParams: 'ignored',
          paths: 'exact',
          fragment: 'ignored',
        }),
      [{ outlets: { primary: ['chatbot'], sidebar: [] } }],
      true,
    ),
    routerButton(
      'Diagnostics',
      'av_timer',
      () =>
        this.router.isActive('info', {
          matrixParams: 'ignored',
          queryParams: 'ignored',
          paths: 'exact',
          fragment: 'ignored',
        }),
      [{ outlets: { primary: ['info'], sidebar: [] } }],
      true,
    ),
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
    this.store.dispatch(sidebarActions.close({ payload: { navigate: false } }));
  }

  public goBack(): void {
    const hasQueryParams = this.router.routerState.snapshot.url.match(/.*[?].*/);
    if (typeof hasQueryParams !== 'undefined' && hasQueryParams !== null && hasQueryParams.length > 0) {
      this.location.back(); // first call resets query params only
      this.location.back();
    } else {
      this.location.back();
    }
  }
}
