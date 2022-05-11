import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, HostListener, Inject, Input, Output } from '@angular/core';
import { AppSidebarState, AppUserState, chatbotActions, sidebarActions } from '@app/client-store';
import { IToolbarAnchor, WINDOW } from '@app/client-util';
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

  @Input() public version?: string;

  @Input() public anchors: IToolbarAnchor[] = [
    {
      href: 'https://github.com/upgraded-enigma/upgraded-enigma/issues/new?assignees=&labels=&template=bug_report.md&title=',
      icon: 'bug_report',
      title: 'Report a bug',
    },
    {
      href: 'https://github.com/upgraded-enigma/upgraded-enigma/issues/new?assignees=&labels=&template=feature_request.md&title=',
      icon: 'lightbulb',
      title: 'Request a feature',
    },
    {
      href: 'https://github.com/upgraded-enigma/upgraded-enigma/issues/new?assignees=&labels=&template=maintenance.md&title=',
      icon: 'engineering',
      title: 'Request maintenance',
    },
  ];

  @Output() public readonly darkThemeEnabled = new EventEmitter<boolean>();

  public readonly sidebarOpened$ = this.store.select(AppSidebarState.state).pipe(map(state => state.sidebarOpened));

  public readonly user$ = this.store.select(AppUserState.token).pipe(map(token => ({ userAuthenticated: Boolean(token) })));

  constructor(public readonly store: Store, @Inject(WINDOW) private readonly win: Window) {}

  public toggleSidebar(): void {
    void this.store.dispatch(new sidebarActions.toggleSidebar());
  }

  public toggleChatbot(): void {
    void this.store.dispatch(new chatbotActions.toggle());
  }

  public toggleMaterialTheme(event: boolean): void {
    this.darkThemeEnabled.emit(event);
  }

  @HostListener('window:scroll')
  public windowScrollHandler() {
    const mod = 75;
    this.fixedPosition = this.win.innerHeight + this.win.scrollY < this.win.document.body.offsetHeight - mod;
  }
}
