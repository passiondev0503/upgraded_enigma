#!/bin/bash

source tools/shell/utils/colors.sh ''
source tools/shell/utils/print-utils.sh ''

##
# Reports usage error and exits.
##
reportUsage() {
  printInfoTitle "<< USAGE >>"
  printInfoMessage "The script installs dependencies in project root folder as well as in /functions if no arguments are provided."
  printInfoMessage "The script Installs global dependencies with sudo if first argument equals 'global'."
  printUsageTip "bash tools/shell/install.sh" "print install.sh usage"
  printUsageTip "bash tools/shell/install.sh project" "install project dependencies only"
  printUsageTip "bash tools/shell/install.sh global" "install global dependencies only"
  printUsageTip "bash tools/shell/install.sh all" "install projects dependencies, global dependencies, shellcheck (linux)"
  printUsageTip "bash tools/shell/install.sh all osx" "install projects dependencies, global dependencies, shellcheck (osx)"
  printUsageTip "bash tools/shell/install.sh shellcheck" "install shellcheck on linux"
  printUsageTip "bash tools/shell/install.sh shellcheck osx" "install shellcheck on osx"
  printGap

  exit 1
}

##
# Installs project dependencies.
##
installProjectDependencies() {
  printInfoTitle "<< INSTALLING PROJECT DEPENDENCIES >>"
  printGap

  cd ./functions || exit 1
  npm install || exit 1
  cd .. || exit 1
  yarn install --frozen-lockfile || exit 1
}

##
# Installs global npm dependencies.
##
installGlobalDependencies() {
  printInfoTitle "<< INSTALLING GLOBAL DEPENDENCIES >>"
  printGap

  sudo npm install -g @angular/cli@latest @ionic/cli@latest @nestjs/cli@latest @ngxs/cli@latest @nrwl/cli@latest typescript@latest firebase-tools@latest @compodoc/compodoc@latest commitizen@latest cz-conventional-changelog@latest yarn@1.22.19 madge@latest npm-check-updates@latest || exit 1
}

##
# Installs Shellcheck on Linux.
##
installShellcheckLinux() {
  printInfoTitle "<< INSTALLING SHELLCHECK on LINUX >>"
  printGap

  sudo apt install shellcheck
}

##
# Installs Shellcheck on Osx.
##
installShellcheckOsx() {
  printInfoTitle "<< INSTALLING SHELLCHECK on OSX >>"
  printGap

  brew install shellcheck
}

##
# Installs shellcheck.
##
installShellcheck() {
  if [ "$1" = "osx" ]; then
    installShellcheckOsx
  else
    installShellcheckLinux
  fi
}

##
# Dependencies installation control flow.
##
if [ $# -lt 1 ]; then
  reportUsage
elif [ "$1" = "all" ]; then
  installProjectDependencies
  installGlobalDependencies
  installShellcheck "$2"
elif [ "$1" = "project" ]; then
  installProjectDependencies
elif [ "$1" = "global" ]; then
  installGlobalDependencies
elif [ "$1" = "shellcheck" ]; then
  installShellcheck "$2"
else
  reportUsage
fi
