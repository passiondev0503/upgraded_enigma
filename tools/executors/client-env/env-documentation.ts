import { ExecutorContext } from '@nrwl/devkit';

import { AppBaseEnvConfig } from './env-base';
import { IExecutorOptions, TSupportedApp } from './schema';

interface IEnvConfig {
  version: string;
}

export class AppDocumentationEnvConfig extends AppBaseEnvConfig<IEnvConfig> {
  public readonly supportedApps: TSupportedApp[] = ['documentation'];

  constructor(options: IExecutorOptions, context: ExecutorContext) {
    super(options, context);
  }
}
