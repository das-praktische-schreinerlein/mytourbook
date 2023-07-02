#!/bin/bash
# exit on error
set -e
CWD=$(pwd)
SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

echo "now: configure linux vars: run sbin/configure-environment.sh"
source ${SCRIPTPATH}/configure-environment.bash

echo "start - export pdocs to run current version"

${SCRIPTPATH}/exportPDocs4BackendConfig.sh dev ./config/ de
${SCRIPTPATH}/exportPDocs4BackendConfig.sh dev ./config/ en
${SCRIPTPATH}/exportPDocs4DistConfig.sh dev ./dist/static/ de
${SCRIPTPATH}/exportPDocs4DistConfig.sh dev ./dist/static/ en

echo "start - export pdocs to run current version"
