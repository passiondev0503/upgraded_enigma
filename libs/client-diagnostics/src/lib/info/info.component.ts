import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { AppMarkdownService } from '@upgraded-enigma/client-services';
import {
  AppDiagnosticsState,
  AppHttpApiState,
  diagnosticsActions,
  httpApiActions,
} from '@upgraded-enigma/client-store';
import { IWebClientAppEnvironment, WEB_CLIENT_APP_ENV } from '@upgraded-enigma/client-util';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppInfoComponent {
  /**
   * Ping result.
   */
  public readonly ping$ = this.store.select(AppHttpApiState.allData).pipe(map(ping => ping.ping));

  public readonly serverData$ = this.store.select(AppDiagnosticsState.state);

  /**
   * Sample processed markdown.
   */
  public readonly markedInstructions$ = of(null).pipe(
    map(() => {
      const apiInstructions = `# API endpoints:\n
    - ${this.env.api}/auth
    - ${this.env.api}/diagnostics
    - ${this.env.api}/user`;
      return this.markdown.process(apiInstructions);
    }),
  );

  constructor(
    private readonly markdown: AppMarkdownService,
    private readonly store: Store,
    @Inject(WEB_CLIENT_APP_ENV) private readonly env: IWebClientAppEnvironment,
  ) {
    void this.store.dispatch(new httpApiActions.ping()).subscribe();
    void this.store.dispatch(new diagnosticsActions.getStaticData()).subscribe();
  }
}
