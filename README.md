# Upgraded Enigma

Organizer and productivity tools mono-repository.

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Workflows

| Info                                                                         | Trigger                             | Badge                                                                                                                                                                                                                             |
| ---------------------------------------------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [:information_source:](# 'Quality gates.')                                   | PR open event (destination: trunk)  | [![pr-validation](https://github.com/upgraded-enigma/upgraded-enigma/actions/workflows/pr-validation.yml/badge.svg)](https://github.com/upgraded-enigma/upgraded-enigma/actions/workflows/pr-validation.yml)                      |
| [:information_source:](# 'Full testing, deliverables build and deployment.') | PR merge event (destination: trunk) | [![trunk-on-push](https://github.com/upgraded-enigma/upgraded-enigma/actions/workflows/trunk-on-push.yml/badge.svg)](https://github.com/upgraded-enigma/upgraded-enigma/actions/workflows/trunk-on-push.yml)                      |
| [:information_source:](# 'User acceptance testing.')                         | Manual                              | [![e2e-test](https://github.com/upgraded-enigma/upgraded-enigma/actions/workflows/e2e-test.yml/badge.svg)](https://github.com/upgraded-enigma/upgraded-enigma/actions/workflows/e2e-test.yml)                                     |
| [:information_source:](# 'Code ownership validation.')                       | Scheduled (weekly)                  | [![codeowners-validator](https://github.com/upgraded-enigma/upgraded-enigma/actions/workflows/codeowners-validator.yml/badge.svg)](https://github.com/upgraded-enigma/upgraded-enigma/actions/workflows/codeowners-validator.yml) |
| [:information_source:](# 'Source code security scanning.')                   | Manual, Scheduled (weekly)          | [![codeql-analysis](https://github.com/upgraded-enigma/upgraded-enigma/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/upgraded-enigma/upgraded-enigma/actions/workflows/codeql-analysis.yml)                |

## Requirements

In order to run own copy of the project one must fulfill the following requirements.

### Supported operating systems

- :trophy: [Debian based Linux](https://en.wikipedia.org/wiki/List_of_Linux_distributions#Debian-based) - `recommended`
  - check out [this dev setup instructions](https://github.com/rfprod/wdsdu) to facilitate setting up the dev environment;
  - given that the dev environment is set up, the command `yarn install:all:linux` should install everything needed to work with the project;
- :ok: [OSX](https://en.wikipedia.org/wiki/MacOS) - `should work due to the similarities with Linux`
  - one will have to figure out oneself how to set up the dev environment;
  - given that the dev environment is set up, the command `yarn install:all:osx` should install everything needed to work with the project;
  - the automation scripts support the OS with relatively high probability, but it has not been tested;
- :no_entry_sign: [Windows](https://en.wikipedia.org/wiki/Microsoft_Windows) - `not recommended`
  - one will have to figure out oneself how to set up the dev environment;
  - one will have to figure out oneself how to install required dependencies like `shellcheck` system wide;
  - the automation scripts support the OS with relatively low probability, but it has not been tested.

### Core dependencies

- [Node.js](https://nodejs.org/)
- [NPM](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

### Preferred package manager

- [Yarn](https://www.npmjs.com/package/yarn) - preferred package manager for dependencies installation in the project root.
- [npm](https://www.npmjs.com/) - preferred package manager for dependencies installation in the `functions` folder.

## Package scripts reference

The project has lots of package scripts, check it in the `package.json` located in the project root, or use the following command (see terminal output for usage tips)

```bash
yarn workspace:help
```

## Committing changes to repo

Using [commitizen cli](https://github.com/commitizen/cz-cli) is mandatory.

Provided all dependencies are installed, and [commitizen cli is installed as a global dependency](https://github.com/commitizen/cz-cli#conventional-commit-messages-as-a-global-utility), this command must be used.

```bash
git cz
```

## GitBook documentation

The GitBook documentation is generated based on this GitHub repo.

- [GitBook documentation](https://rfprod.gitbook.io/upgraded-enigma/)

## Firebase deployment

Application deployments and autogenerated engineering documentation.

- [Client](https://upgraded-enigma.web.app)
- [Elements](https://upgraded-enigma-elements.web.app)
- [Documentation](https://upgraded-enigma-documentation.web.app)
  - [Compodoc](https://upgraded-enigma-documentation.web.app/assets/compodoc/index.html)
  - [Storybook](https://upgraded-enigma-documentation.web.app/assets/storybook/index.html)
  - [Unit test reports](https://upgraded-enigma-documentation.web.app/assets/coverage/index.html)
  - [E2E test reports](https://upgraded-enigma-documentation.web.app/assets/cypress/index.html)
  - [Changelogs](https://upgraded-enigma-documentation.web.app/assets/changelog/index.html)

## Workspace generators

### Generate a client feature library

```bash
yarn workspace:schematic client-feature client-<feature-name> --tags=scope:client-<feature-name>,type:feature
```

## General Tooling

This project was generated using [Nx](https://nx.dev).

<p align="center"><img src="https://raw.githubusercontent.com/nrwl/nx/master/nx-logo.png" width="450"></p>

🔎 **Nx is a set of Angular CLI power-ups for modern development.**

### Quick Start & Documentation

- [Nx Documentation](https://nx.dev)
- [30-minute video showing all Nx features](https://nx.dev/getting-started/what-is-nx)
- [Interactive Tutorial](https://nx.dev/tutorial/01-create-application)

### Adding capabilities to the workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, .etc as well as the devtools to test, and build projects as well.

Below are some plugins which can be added to the workspace:

| Application type                       | Command                  | Part of the workspace |
| -------------------------------------- | ------------------------ | --------------------- |
| [Angular](https://angular.io)          | `ng add @nrwl/angular`   | :heavy_check_mark:    |
| [React](https://reactjs.org)           | `ng add @nrwl/react`     | :x:                   |
| Web (no framework frontends)           | `ng add @nrwl/web`       | :heavy_check_mark:    |
| [Nest](https://nestjs.com)             | `ng add @nrwl/nest`      | :heavy_check_mark:    |
| [Express](https://expressjs.com)       | `ng add @nrwl/express`   | :x:                   |
| [Node](https://nodejs.org)             | `ng add @nrwl/node`      | :heavy_check_mark:    |
| [Storybook](https://storybook.js.org/) | `ng add @nrwl/storybook` | :heavy_check_mark:    |
| [Cypress](https://www.cypress.io/)     | `ng add @nrwl/cypress`   | :heavy_check_mark:    |

### Generating an application

To generate an application run:

```bash
ng g @nrwl/angular:app my-app
```

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

### Generating a library

To generate a library run:

```bash
ng g @nrwl/angular:lib my-lib
```

> You can also use any of the plugins above to generate libraries as well.

Libraries are sharable across libraries and applications.

It can be imported from `@upgraded-enigma/mylib`.

### Running a development server

To start a dev server run:

```bash
ng serve my-app
```

Navigate to http://localhost:4200/.

The app will automatically reload if you change any of the source files.

### Code scaffolding

To generate a new component run:

```bash
ng g component my-component --project=my-app
```

### Building applications

To build the project run:

```bash
ng build my-app
```

The build artifacts will be stored in the `dist/` directory.

Use the `--prod` flag for a production build.

### Unit testing with [Jest](https://jestjs.io)

To execute the unit tests run:

```bash
ng test my-app
```

To execute the unit tests affected by a change run:

```bash
npm run affected:test
```

### End-to-end testing with [Cypress](https://www.cypress.io)

To execute the end-to-end tests run:

```bash
ng e2e my-app
```

To execute the end-to-end tests affected by a change run:

```bash
npm run affected:e2e
```

### Understanding the workspace

To see a diagram of the dependencies of the projects run:

```bash
npm run dep-graph
```

### Generating a storybook for a feature or ui library

```bash
npx nx g @nrwl/angular:storybook-configuration project-name
```

### Tools help

```bash
ng run tools:help
```

### Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.

## Technologies Reference

### Workspace

- [Nrwl Nx](https://nx.dev)

### Client

- [Angular](https://angular.io)
- [Angular CLI](https://cli.angular.io/)
- [Angular Material](https://material.angular.io/)
- [Material Design Guidelines](https://material.io)
- [NGXS](https://www.ngxs.io/)

### Server

- [NestJS](https://nestjs.com/)
- [Firebase JS Reference](https://firebase.google.com/docs/reference/js/)

### Testing

- [Cypress](https://www.cypress.io/)
- [Jest](https://jestjs.io/)

### Documentation

- [Compodoc](https://compodoc.github.io/compodoc/)

### CI

- [GitHub Actions](https://github.com/features/actions)

### Development methodology

- [Trunk based development](https://trunkbaseddevelopment.com/)
