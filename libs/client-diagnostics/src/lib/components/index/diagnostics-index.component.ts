import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { IWebsocketState, websocketActions } from '@app/client-store-websocket';
import { Store } from '@ngrx/store';

/**
 * Application index component.
 */
@Component({
  selector: 'app-diagnostics-index',
  templateUrl: './diagnostics-index.component.html',
  styleUrls: ['./diagnostics-index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppDiagnosticsIndexComponent implements OnDestroy {
  constructor(private readonly store: Store<IWebsocketState>) {
    this.store.dispatch(websocketActions.sendEvent({ payload: { eventType: 'get-diag-dynamic' } }));
  }

  public ngOnDestroy() {
    this.store.dispatch(websocketActions.sendEvent({ payload: { eventType: 'stop-diag-dynamic' } }));
  }
}
