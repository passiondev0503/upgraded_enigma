import { IDocAppEnvironment } from '../app/interfaces/environment.interface';
import { appEnvFactory } from './environment.config';

/**
 * Develompent environment variables.
 * This file can be replaced during build by using the 'fileReplacements' array.
 * 'ng build --prod' replaces 'environment.ts' with 'environment.prod.ts'.
 * The list of file replacements can be found in 'angular.json'.
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as 'zone.run', 'zoneDelegate.invokeTask'.
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 * import 'zone.js/dist/zone-error';  // Included with Angular CLI.
 */
export const environment: IDocAppEnvironment = {
  production: false,
  testing: false,
  appName: 'Upgraded Enigma Documentation',
  description: 'Upgraded Enigma documentation',
  ...appEnvFactory(),
  // eslint-disable-next-line prettier/prettier -- no need to make it pretty here due autogeneration
  mdFilePaths: ['tools/ts/README.md', 'libs/backend-interfaces/README.md', 'libs/client-directives/README.md', 'libs/client-util-sentry/README.md', 'libs/client-util/README.md', 'libs/client-user/README.md', 'libs/backend-auth/README.md', 'libs/client-store/README.md', 'libs/client-pwa-offline/README.md', 'libs/client-testing-unit/README.md', 'libs/backend-diagnostics/README.md', 'libs/client-diagnostics/README.md', 'libs/client-material/README.md', 'libs/client-chatbot/README.md', 'libs/client-core-components/README.md', 'libs/client-translate/README.md', 'libs/client-pipes/README.md', 'tools/ts/UNIT_COVERAGE.md', 'libs/backend-websocket/README.md', 'libs/backend-logger/README.md', 'libs/client-workspaces/README.md', 'libs/client-services/README.md', 'tools/shell/README.md', 'libs/client-core/README.md', 'libs/client-sidebar/README.md', 'tools/README.md'],
};
