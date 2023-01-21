import { AppMessage } from '@app/backend-interfaces';
import { Controller, Get, Inject } from '@nestjs/common';

import type { IDiagnosticsService } from '../interfaces/diagnostics.interface';
import { DIAGNOSTICS_SERVICE_TOKEN } from '../services/diagnostics.service';

@Controller('diagnostics')
export class AppDiagnosticsController {
  constructor(@Inject(DIAGNOSTICS_SERVICE_TOKEN) private readonly diagnosticsService: IDiagnosticsService) {}

  @Get('')
  public ping(): AppMessage {
    return this.diagnosticsService.ping();
  }

  @Get('static')
  public static() {
    return this.diagnosticsService.static();
  }
}
