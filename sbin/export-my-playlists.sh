#!/bin/bash
# exit on error
set -e
CWD=$(pwd)
SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

${SCRIPTPATH}/dataexport-playlist.sh "D:\\export\\Bilder-flat\\top-favorites" "" "top-favorites" "fullonly" "flat" "flat" "" "9" "showall"
${SCRIPTPATH}/dataexport-playlist.sh "D:\\export\\Bilder\\prod-favorites" "Favorites" "favorites" "prod" "default" "default" "prod" "2" "nonblocked"
