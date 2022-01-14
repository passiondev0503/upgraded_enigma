import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { AppWebsocketService } from '@app/client-store';

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
  constructor(private readonly ws: AppWebsocketService) {
    this.ws.getDynamicDiagnosticData();
  }

  public ngOnDestroy() {
    this.ws.stopDynamicDiagnosticData();
  }
}
