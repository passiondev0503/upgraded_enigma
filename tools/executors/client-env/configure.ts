import { ExecutorContext } from '@nrwl/devkit';

import { AppBaseEnvConfig } from './env-base';
import { AppClientEnvConfig } from './env-client';
import { AppDocumentationEnvConfig } from './env-documentation';
import { IExecutorOptions } from './schema';

export default async function clientEnvExecutor(options: IExecutorOptions, context: ExecutorContext): Promise<{ success: boolean }> {
  const app = options.app;
  let config: AppBaseEnvConfig | undefined;

  switch (app) {
    case 'client':
      config = new AppClientEnvConfig(options, context);
      break;
    case 'documentation':
      config = new AppDocumentationEnvConfig(options, context);
      break;
    default:
      break;
  }

  if (typeof config !== 'undefined') {
    await config.execute();
  } else {
    throw new Error(`There was an error processing the app argument.\nIts value is: ${app}`);
  }

  return { success: true };
}
