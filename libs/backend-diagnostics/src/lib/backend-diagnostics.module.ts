import { DynamicModule, Module, Provider } from '@nestjs/common';

import { AppDiagnosticsController } from './controller/diagnostics.controller';
import { AppDiagnosticsService } from './service/diagnostics.service';

export const diagnosticsModuleProviders: Provider[] = [AppDiagnosticsService];

@Module({
  controllers: [AppDiagnosticsController],
})
export class AppDiagnosticsModule {
  public static forRoot(): DynamicModule {
    return {
      module: AppDiagnosticsModule,
      providers: [...diagnosticsModuleProviders],
    };
  }
}
