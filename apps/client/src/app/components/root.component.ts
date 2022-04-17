import { ChangeDetectionStrategy, Component, HostBinding, Inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AppUserState } from '@app/client-store';
import { IWebClientAppEnvironment, WEB_CLIENT_APP_ENV } from '@app/client-util';
import { Store } from '@ngxs/store';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppRootComponent implements OnInit {
  /**
   * Defines if UI should use alternative dark material theme.
   * This must be a flag. HostBinding should not use async pipes.
   */
  @HostBinding('class.unicorn-dark-theme') public darkTheme = false;

  /**
   * Sets text size that is inherited by all child views.
   */
  @HostBinding('class.mat-body-1') public matBody = true;

  /**
   * Release version.
   */
  public readonly version = this.env.meta.version;

  /**
   * User authentication state.
   */
  public readonly auth$ = this.store.select(AppUserState.token).pipe(map(token => ({ authenticated: typeof token !== 'undefined' })));

  constructor(
    private readonly title: Title,
    private readonly meta: Meta,
    public readonly store: Store,
    @Inject(WEB_CLIENT_APP_ENV) private readonly env: IWebClientAppEnvironment,
  ) {}

  /**
   * Toggles the material theme.
   * @param darkThemeEnabled dark theme enabled state
   */
  public toggleMaterialTheme(darkThemeEnabled: boolean): void {
    this.darkTheme = darkThemeEnabled;
  }

  public ngOnInit(): void {
    this.title.setTitle(this.env.appName);
    this.meta.updateTag({ description: this.env.description });
  }
}
