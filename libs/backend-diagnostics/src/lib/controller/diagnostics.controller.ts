import { Controller, Get } from '@nestjs/common';
import { Message } from '@upgraded-enigma/backend-interfaces';

import { BackendDiagnosticsService } from '../service/diagnostics.service';

@Controller()
export class BackendDiagnosticsController {
  constructor(private readonly diagnosticsService: BackendDiagnosticsService) {}

  @Get('diagnostics')
  public ping(): Message {
    return this.diagnosticsService.ping();
  }

  @Get('diagnostics/static')
  public static() {
    return this.diagnosticsService.static();
  }
}
