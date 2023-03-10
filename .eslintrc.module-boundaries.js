/**
 * Common module boundary rules based on project types.
 */
const typeConstraints = [
  {
    sourceTag: 'type:application',
    onlyDependOnLibsWithTags: ['type:feature', 'type:data-access', 'type:ui', 'type:util', 'type:testing-unit'],
  },
  {
    sourceTag: 'type:feature',
    onlyDependOnLibsWithTags: ['type:data-access', 'type:ui', 'type:util', 'type:testing-unit'],
  },
  {
    sourceTag: 'type:data-access',
    onlyDependOnLibsWithTags: ['type:data-access', 'type:util', 'type:testing-unit'],
  },
  {
    sourceTag: 'type:ui',
    onlyDependOnLibsWithTags: ['type:ui', 'type:util', 'type:testing-unit'],
  },
  {
    sourceTag: 'type:util',
    onlyDependOnLibsWithTags: ['type:util', 'type:testing-unit'],
  },
  {
    sourceTag: 'type:e2e',
    onlyDependOnLibsWithTags: ['type:util'],
  },
];

/**
 * Shared module boundary rules based on scopes.
 */
const sharedConstraints = [];

/**
 * Backend module boundary rules based on scopes.
 */
const backendConstraints = [
  {
    sourceTag: 'scope:api',
    onlyDependOnLibsWithTags: ['scope:backend-diagnostics', 'scope:backend-interfaces', 'scope:backend-logger', 'scope:backend-websocket'],
  },
  {
    sourceTag: 'scope:client-api',
    onlyDependOnLibsWithTags: [
      'scope:backend-auth',
      'scope:backend-diagnostics',
      'scope:backend-interfaces',
      'scope:backend-logger',
      'scope:backend-websocket',
    ],
  },
  {
    sourceTag: 'scope:backend-auth',
    onlyDependOnLibsWithTags: ['scope:backend-interfaces'],
  },
  {
    sourceTag: 'scope:backend-diagnostics',
    onlyDependOnLibsWithTags: ['scope:backend-interfaces'],
  },
  {
    sourceTag: 'scope:backend-interfaces',
    onlyDependOnLibsWithTags: [],
  },
  {
    sourceTag: 'scope:backend-logger',
    onlyDependOnLibsWithTags: [],
  },
  {
    sourceTag: 'scope:backend-websocket',
    onlyDependOnLibsWithTags: ['scope:backend-diagnostics', 'scope:backend-interfaces'],
  },
  {
    sourceTag: 'scope:server-dev',
    onlyDependOnLibsWithTags: [],
  },
  {
    sourceTag: 'scope:server-prod',
    onlyDependOnLibsWithTags: [],
  },
];

/**
 * Client module boundary rules based on scopes.
 */
const clientConstraints = [
  {
    sourceTag: 'scope:documentation',
    onlyDependOnLibsWithTags: [
      'scope:client-material',
      'scope:client-pwa-offline',
      'scope:client-store-router',
      'scope:client-testing-unit',
      'scope:client-util',
      'scope:client-util-ngrx',
    ],
  },
  {
    sourceTag: 'scope:documentation-e2e',
    onlyDependOnLibsWithTags: ['scope:client-util'],
  },
  {
    sourceTag: 'scope:client-testing-unit',
    onlyDependOnLibsWithTags: ['scope:client-material', 'scope:client-util', 'scope:client-util-ngrx'],
  },
  {
    sourceTag: 'scope:client-material',
    onlyDependOnLibsWithTags: [],
  },
  {
    sourceTag: 'scope:client-pwa-offline',
    onlyDependOnLibsWithTags: ['scope:client-util'],
  },
  {
    sourceTag: 'scope:client-core',
    onlyDependOnLibsWithTags: ['scope:client-store', 'scope:client-util'],
  },
  {
    sourceTag: 'scope:client-store',
    onlyDependOnLibsWithTags: [
      'scope:client-store-chatbot',
      'scope:client-store-diagnostics',
      'scope:client-store-http-progress',
      'scope:client-store-http-api',
      'scope:client-store-sidebar',
      'scope:client-store-theme',
      'scope:client-store-user',
      'scope:client-translate',
      'scope:client-testing-unit',
      'scope:client-util',
    ],
  },
  {
    sourceTag: 'scope:client-store-chatbot',
    onlyDependOnLibsWithTags: ['scope:client-testing-unit', 'scope:client-util'],
  },
  {
    sourceTag: 'scope:client-store-diagnostics',
    onlyDependOnLibsWithTags: ['scope:client-store-http-progress', 'scope:client-testing-unit', 'scope:client-util'],
  },
  {
    sourceTag: 'scope:client-store-http-api',
    onlyDependOnLibsWithTags: [
      'scope:client-store-http-progress',
      'scope:client-translate',
      'scope:client-testing-unit',
      'scope:client-util',
    ],
  },
  {
    sourceTag: 'scope:client-store-http-progress',
    onlyDependOnLibsWithTags: ['scope:client-translate', 'scope:client-testing-unit', 'scope:client-util'],
  },
  {
    sourceTag: 'scope:client-store-router',
    onlyDependOnLibsWithTags: ['scope:client-testing-unit', 'scope:client-util', 'scope:client-util-ngrx'],
  },
  {
    sourceTag: 'scope:client-store-sidebar',
    onlyDependOnLibsWithTags: ['scope:client-testing-unit', 'scope:client-util'],
  },
  {
    sourceTag: 'scope:client-store-theme',
    onlyDependOnLibsWithTags: ['scope:client-testing-unit', 'scope:client-util'],
  },
  {
    sourceTag: 'scope:client-store-user',
    onlyDependOnLibsWithTags: ['scope:client-store-http-progress', 'scope:client-testing-unit', 'scope:client-util'],
  },
  {
    sourceTag: 'scope:client-store-websocket',
    onlyDependOnLibsWithTags: ['scope:client-store-diagnostics', 'scope:client-testing-unit', 'scope:client-util'],
  },
  {
    sourceTag: 'scope:client-services',
    onlyDependOnLibsWithTags: ['scope:client-testing-unit', 'scope:client-util'],
  },
  {
    sourceTag: 'scope:client-componnents',
    onlyDependOnLibsWithTags: [
      'scope:client-core',
      'scope:client-material',
      'scope:client-pipes',
      'scope:client-store',
      'scope:client-testing-unit',
      'scope:client-util',
    ],
  },
  {
    sourceTag: 'scope:client-diagnostics',
    onlyDependOnLibsWithTags: [
      'scope:client-core',
      'scope:client-material',
      'scope:client-store-diagnostics',
      'scope:client-store-http-api',
      'scope:client-store-http-progress',
      'scope:client-store-user',
      'scope:client-store-websocket',
      'scope:client-services',
      'scope:client-translate',
      'scope:client-testing-unit',
      'scope:client-util',
    ],
  },
  {
    sourceTag: 'scope:client-directives',
    onlyDependOnLibsWithTags: ['scope:client-testing-unit'],
  },
  {
    sourceTag: 'scope:client-chatbot',
    onlyDependOnLibsWithTags: [
      'scope:client-directives',
      'scope:client-material',
      'scope:client-store',
      'scope:client-translate',
      'scope:client-testing-unit',
    ],
  },
  {
    sourceTag: 'scope:client-util',
    onlyDependOnLibsWithTags: [],
  },
  {
    sourceTag: 'scope:client-util-ngrx',
    onlyDependOnLibsWithTags: [],
  },
  {
    sourceTag: 'scope:client-util-sentry',
    onlyDependOnLibsWithTags: ['scope:client-testing-unit', 'scope:client-util'],
  },
  {
    sourceTag: 'scope:client-user',
    onlyDependOnLibsWithTags: [
      'scope:client-material',
      'scope:client-services',
      'scope:client-store-user',
      'scope:client-translate',
      'scope:client-testing-unit',
      'scope:client-util',
    ],
  },
  {
    sourceTag: 'scope:client-workspaces',
    onlyDependOnLibsWithTags: ['scope:client-material', 'scope:client-store', 'scope:client-testing-unit'],
  },
  {
    sourceTag: 'scope:client-translate',
    onlyDependOnLibsWithTags: ['scope:client-material', 'scope:client-util'],
  },
  {
    sourceTag: 'scope:client',
    onlyDependOnLibsWithTags: [
      'scope:client-chatbot',
      'scope:client-core',
      'scope:client-core-components',
      'scope:client-diagnostics',
      'scope:client-services',
      'scope:client-sidebar',
      'scope:client-store',
      'scope:client-store-router',
      'scope:client-store-user',
      'scope:client-store-websocket',
      'scope:client-material',
      'scope:client-pwa-offline',
      'scope:client-translate',
      'scope:client-testing-unit',
      'scope:client-user',
      'scope:client-util',
      'scope:client-util-ngrx',
      'scope:client-util-sentry',
      'scope:client-workspaces',
    ],
  },
  {
    sourceTag: 'scope:client-sidebar',
    onlyDependOnLibsWithTags: ['scope:client-store-http-progress', 'scope:client-store-sidebar', 'scope:client-testing-unit'],
  },
  {
    sourceTag: 'scope:client-pipes',
    onlyDependOnLibsWithTags: ['scope:client-store', 'scope:client-util'],
  },
  {
    sourceTag: 'scope:client-core-components',
    onlyDependOnLibsWithTags: [
      'scope:client-material',
      'scope:client-pipes',
      'scope:client-store-chatbot',
      'scope:client-store-router',
      'scope:client-store-sidebar',
      'scope:client-store-theme',
      'scope:client-store-user',
      'scope:client-translate',
      'scope:client-testing-unit',
      'scope:client-util',
    ],
  },
  {
    sourceTag: 'scope:client-e2e',
    onlyDependOnLibsWithTags: ['scope:client-util'],
  },
  {
    sourceTag: 'scope:client-core-components-e2e',
    onlyDependOnLibsWithTags: ['scope:client-util'],
  },
];

/**
 * Nrwl nx module boudary rules.
 */
exports.nxModuleBoundaryRules = {
  enforceBuildableLibDependency: true,
  allow: [],
  depConstraints: [...sharedConstraints, ...clientConstraints, ...backendConstraints, ...typeConstraints],
};
