export type TSupportedApp = 'client' | 'documentation';

export interface IExecutorOptions {
  app: TSupportedApp;
  reset?: boolean;
}
