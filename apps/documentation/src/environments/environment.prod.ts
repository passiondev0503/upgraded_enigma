import { IDocAppEnvironment } from '../app/interfaces/environment.interface';
import { appEnvFactory } from './environment.config';

export const environment: IDocAppEnvironment = {
  production: true,
  appName: 'Upgraded Enigma Documentation',
  description: 'Upgraded Enigma documentation',
  ...appEnvFactory(),
  // eslint-disable-next-line prettier/prettier -- no need to make it pretty here due autogeneration
  mdFilePaths: ['tools/ts/README.md', 'libs/backend-interfaces/README.md', 'libs/client-directives/README.md', 'libs/client-util-sentry/README.md', 'libs/client-util/README.md', 'libs/client-user/README.md', 'libs/backend-auth/README.md', 'libs/client-store/README.md', 'libs/client-util-eliza/README.md', 'libs/client-pwa-offline/README.md', 'libs/client-unit-testing/README.md', 'libs/backend-diagnostics/README.md', 'libs/client-diagnostics/README.md', 'libs/client-material/README.md', 'libs/client-chatbot/README.md', 'libs/client-core-components/README.md', 'libs/client-translate/README.md', 'libs/client-pipes/README.md', 'tools/ts/UNIT_COVERAGE.md', 'libs/backend-websocket/README.md', 'libs/backend-logger/README.md', 'libs/client-workspaces/README.md', 'libs/client-services/README.md', 'tools/shell/README.md', 'libs/client-core/README.md', 'libs/client-sidebar/README.md', 'tools/README.md'],
};
