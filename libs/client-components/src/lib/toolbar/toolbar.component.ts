import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { AppSidebarState, chatbotActions, sidebarUiActions } from '@upgraded-enigma/client-store';
import { IToolbarButton } from '@upgraded-enigma/client-util';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppToolbarComponent {
  @Input() public buttons: IToolbarButton[] = [
    {
      routerLink: [''],
      icon: 'home',
      title: 'Home',
    },
    {
      routerLink: ['info'],
      icon: 'touch_app',
      title: 'API info',
    },
    {
      routerLink: ['user/auth'],
      icon: 'input',
      title: 'Login',
    },
    {
      routerLink: ['user'],
      icon: 'verified_user',
      title: 'User profile',
    },
    {
      routerLink: ['user/data'],
      icon: 'dashboard',
      title: 'User data',
    },
    {
      routerLink: ['user/rtc-chat'],
      icon: 'voice_chat',
      title: 'RTC Chat',
    },
    {
      routerLink: ['workspaces'],
      icon: 'view_comfy',
      title: 'Workspaces',
    },
    {
      routerLink: ['chatbot'],
      icon: 'chat',
      title: 'Chat',
    },
  ];

  public readonly sidebarOpened$ = this.store
    .select(AppSidebarState.getState)
    .pipe(map(state => state.sidebarOpened));

  constructor(public readonly store: Store) {}

  public sidebarCloseHandler(): void {
    void this.store.dispatch(new sidebarUiActions.closeSidebar());
  }

  public sidebarOpenHandler(): void {
    void this.store.dispatch(new sidebarUiActions.openSidebar());
  }

  public toggleChatbot(): void {
    void this.store.dispatch(new chatbotActions.toggle());
  }
}
