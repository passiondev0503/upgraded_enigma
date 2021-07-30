import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { AppWebsocketService } from '@app/client-store';

/**
 * Application index component.
 */
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppIndexComponent implements OnDestroy {
  constructor(private readonly ws: AppWebsocketService) {
    this.ws.getDynamicDiagnosticData();
  }

  public ngOnDestroy() {
    this.ws.stopDynamicDiagnosticData();
  }
}
