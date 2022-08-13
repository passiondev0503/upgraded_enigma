import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IDiagnosticsStateModel } from '@app/client-store-diagnostics';

@Component({
  selector: 'app-diagnostics-info-page',
  templateUrl: './diagnostics-info-page.component.html',
  styleUrls: ['./diagnostics-info-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppDiagnosticsInfoPage {
  @Input() public ping = '';

  @Input() public markedInstructions = '';

  @Input() public diagnosticsData: IDiagnosticsStateModel | null = null;
}
