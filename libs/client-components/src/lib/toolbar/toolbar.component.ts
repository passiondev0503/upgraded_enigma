import { ChangeDetectionStrategy, Component, HostBinding, HostListener, Inject, Input } from '@angular/core';
import { AppSidebarState, AppUserState, chatbotActions, sidebarActions, userActions } from '@app/client-store';
import { IButton, WINDOW } from '@app/client-util';
import { Store } from '@ngxs/store';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppToolbarComponent {
  @HostBinding('class.fixed-position-toolbar') public fixedPosition =
    this.win.innerHeight + this.win.scrollY < this.win.document.body.offsetHeight;

  @Input() public buttons: IButton[] = [
    {
      routerLink: ['user/auth'],
      icon: 'input',
      title: 'Log in',
      requiresAuth: false,
    },
    {
      routerLink: [''],
      icon: 'lock',
      title: 'Log out',
      requiresAuth: true,
      click: () => {
        void this.store.dispatch(new userActions.logOut()).subscribe();
      },
    },
    {
      routerLink: ['user'],
      icon: 'verified_user',
      title: 'User profile',
      requiresAuth: true,
    },
    {
      routerLink: ['user/data'],
      icon: 'dashboard',
      title: 'User data',
      requiresAuth: true,
    },
    {
      routerLink: ['user/rtc-chat'],
      icon: 'voice_chat',
      title: 'RTC Chat',
      requiresAuth: true,
    },
    {
      routerLink: ['workspaces'],
      icon: 'view_comfy',
      title: 'Workspaces',
      requiresAuth: true,
    },
    {
      routerLink: ['chatbot'],
      icon: 'chat',
      title: 'Chat',
      requiresAuth: true,
    },
  ];

  public readonly sidebarOpened$ = this.store.select(AppSidebarState.getState).pipe(map(state => state.sidebarOpened));

  public readonly user$ = this.store.select(AppUserState.token).pipe(map(token => ({ userAuthenticated: Boolean(token) })));

  constructor(public readonly store: Store, @Inject(WINDOW) private readonly win: Window) {}

  public toggleSidebar(): void {
    void this.store.dispatch(new sidebarActions.toggleSidebar());
  }

  public toggleChatbot(): void {
    void this.store.dispatch(new chatbotActions.toggle());
  }

  @HostListener('window:scroll')
  public windowScrollHandler() {
    const mod = 75;
    this.fixedPosition = this.win.innerHeight + this.win.scrollY < this.win.document.body.offsetHeight - mod;
  }
}
