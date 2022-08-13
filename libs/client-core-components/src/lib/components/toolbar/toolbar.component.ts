import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, HostListener, Inject, Input, Output } from '@angular/core';
import { chatbotActions, IChatbotState } from '@app/client-store-chatbot';
import { ISidebarState, sidebarActions, sidebarSelectors } from '@app/client-store-sidebar';
import { IUserState, userSelectors } from '@app/client-store-user';
import { anchorButton, IAnchorButton, WINDOW } from '@app/client-util';
import { Store } from '@ngrx/store';

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

  @Input() public anchors: IAnchorButton[] = [
    anchorButton(
      'Report a bug',
      'bug_report',
      'https://github.com/upgraded-enigma/upgraded-enigma/issues/new?assignees=&labels=&template=bug_report.md&title=',
    ),
    anchorButton(
      'Request a feature',
      'lightbulb',
      'https://github.com/upgraded-enigma/upgraded-enigma/issues/new?assignees=&labels=&template=feature_request.md&title=',
    ),
    anchorButton(
      'Request maintenance',
      'engineering',
      'https://github.com/upgraded-enigma/upgraded-enigma/issues/new?assignees=&labels=&template=maintenance.md&title=',
    ),
  ];

  @Output() public readonly darkThemeEnabled = new EventEmitter<boolean>();

  public readonly sidebarOpened$ = this.store.select(sidebarSelectors.sidebarOpened);

  public readonly user$ = this.store.select(userSelectors.userState);

  constructor(public readonly store: Store<IChatbotState & ISidebarState & IUserState>, @Inject(WINDOW) private readonly win: Window) {}

  public toggleSidebar(): void {
    this.store.dispatch(sidebarActions.toggle());
  }

  public toggleChatbot(): void {
    this.store.dispatch(chatbotActions.toggle());
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
