import { Logger, Module, OnModuleDestroy } from '@nestjs/common';

import { AppService } from './services/app.service';

@Module({
  imports: [],
  controllers: [],
  providers: [AppService],
})
export class AppModule implements OnModuleDestroy {
  constructor(private readonly service: AppService) {}

  public onModuleDestroy() {
    Logger.verbose(`\n${new Date(Date.now())}: Dev server > received exit signal - terminating app...\n`);

    this.service.resetEnvironments();
  }
}
