#!/bin/bash
# exit on error
set -e
CWD=$(pwd)
SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

echo "now: configure linux vars: run sbin/configure-environment.sh"
source ${SCRIPTPATH}/configure-environment.bash

${SCRIPTPATH}/dataexport-playlist.sh "dev" "${W_EXPORT_BASEDIR}Bilder-flat\\top-favorites" "" "top-favorites" "fullonly" "flat" "flat" "9" "showall"
#${SCRIPTPATH}/dataexport-playlist.sh "prod" "${W_EXPORT_BASEDIR}Bilder\\prod-favorites" "Favorites" "favorites" "prod" "default" "default" "2" "nonblocked"
