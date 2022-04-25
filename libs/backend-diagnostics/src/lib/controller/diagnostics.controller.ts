import { AppMessage } from '@app/backend-interfaces';
import { Controller, Get } from '@nestjs/common';

import { AppDiagnosticsService } from '../service/diagnostics.service';

@Controller()
export class AppDiagnosticsController {
  constructor(private readonly diagnosticsService: AppDiagnosticsService) {}

  @Get('diagnostics')
  public ping(): AppMessage {
    return this.diagnosticsService.ping();
  }

  @Get('diagnostics/static')
  public static() {
    return this.diagnosticsService.static();
  }
}
