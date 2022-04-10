import { Logger, Module, OnModuleDestroy } from '@nestjs/common';

import { AppServerDevService } from './services/server-dev.service';

@Module({
  imports: [],
  controllers: [],
  providers: [AppServerDevService],
})
export class AppServerDevModule implements OnModuleDestroy {
  constructor(private readonly service: AppServerDevService) {}

  public onModuleDestroy() {
    Logger.verbose(`\n${new Date(Date.now())}: Dev server > received exit signal - terminating app...\n`);

    this.service.resetEnvironments();
  }
}
