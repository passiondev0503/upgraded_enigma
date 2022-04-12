# tools/shell

This folder contains utility shell scripts.

- `utils/colors.sh` - color definitions for usage with `printf` command for comprehensiveness
- `utils/module-aliases.sh` - supported module aliases script (used by other scripts to determine if module alias exists before performing action)
- `utils/print-utils.sh` - printing utilities for usage in other shell scripts
- `build-docs.sh` - documentation building script
- `build-android.sh` - android application building script
- `build-mobile.sh` - mobile application building script
- `changelog.sh` - apps/libs changelog generation script
- `diagrams.sh` - generates images from mermaid diagrams
- `e2e.sh` - apps e2e testing script
- `firebase-deploy.sh` - firebase deployment script
- `generate-e2e-test-report-index.sh` - generates an index page that lists all generated e2e test report index pages
- `generate-unit-test-coverage-index.sh` - generates an index page that lists all generated unit test coverage report index pages
- `generate-proto.sh` - grpc and ts definitions generation script
- `git-extension.sh` - git-extension script (detects changed files so that linting/testing can be preformed for changed files only)
- `install.sh` - dependencies installation script
- `lint.sh` - apps/libs linting script
- `set-documentation-env.sh` - documentation app prebuild script, collects references to \*.md files across the repo
- `test.sh` - apps/libs unit testing script
- `yarn-extension.sh` - checks package integrity and cleans up workspace if there is no integrity

## Usage

All scripts in this directory are verbose, i.e. when a script does something it reports its progress to the terminal.

Some scripts that have complex internal logic or handle different scenarios (i.e. have complex control flow) report usage errors (with examples of the correct usage) to the terminal if usage error occurs.

The scripts are not intended to be used directly by developers during local development.

Those scripts that are used during local development flow are integrated into the workspace by means of the `package.json` scripts. See command, and read the terminal output carefully

```bash
yarn workspace:help
```
