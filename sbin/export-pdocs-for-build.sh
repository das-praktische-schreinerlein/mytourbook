#!/bin/bash
# exit on error
set -e
CWD=$(pwd)
SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

echo "now: configure linux vars: run sbin/configure-environment.sh"
source ${SCRIPTPATH}/configure-environment.bash

echo "start - export pdocs to build new version"

${SCRIPTPATH}/exportPDocs4SrcConfig.sh dev ./overrides/before-build/
${SCRIPTPATH}/exportPDocs4BackendConfig.sh dev ./overrides/after-build/config/ de
${SCRIPTPATH}/exportPDocs4BackendConfig.sh dev ./overrides/after-build/config/ en
${SCRIPTPATH}/exportPDocs4DistConfig.sh dev ./overrides/after-build/dist/ de noinline
${SCRIPTPATH}/exportPDocs4DistConfig.sh dev ./overrides/after-build/dist/ en noinline

echo "done -  export pdocs to build new version"
