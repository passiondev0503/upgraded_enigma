#!/bin/bash

source tools/shell/utils/print-utils.sh ''

source tools/shell/utils/config.sh

buildDocumentation() {
  printInfoTitle "<< Building documentation app >>"
  printGap

  npx nx run-many --target=test --all --code-coverage --run-in-band
  npx nx run tools:coverage-stats
  yarn generate:env:documentation

  npx nx run documentation:configure-env
  npx nx build --project documentation --configuration production
  npx nx run documentation:configure-env --reset

  yarn test:reports
  yarn generate:unit-test-coverage-index

  npx nx run tools:compodoc-build
  cp -r ./dist/compodoc ./dist/apps/documentation/assets

  yarn generate:changelog
  yarn e2e:report
  yarn generate:e2e-test-report-index

  ##
  # Note.
  # Storybook build may break from time to time due package changes.
  # It should not block CI/CD.
  ##
  npx nx run documentation:build-storybook || true
  cp -r ./dist/storybook/documentation ./dist/apps/documentation/assets/storybook || true
}

buildDocumentation
