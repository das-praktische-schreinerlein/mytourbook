#!/bin/bash
# exit on error
set -e
CWD=$(pwd)
SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

echo "now: configure linux vars: run sbin/configure-environment.sh"
source ${SCRIPTPATH}/configure-environment.bash

${SCRIPTPATH}/mediaexport.sh "import" "${W_EXPORT_BASEDIR}Bilder-flat\\top-favorites" "" "top-favorites" "all" "flat" "flat" "2" "showall" "" createhtml
#${SCRIPTPATH}/mediaexport.sh "prod" "${W_EXPORT_BASEDIR}Bilder\\prod-favorites" "Favorites" "favorites" "prod" "default" "default" "2" "nonblocked" ""

${SCRIPTPATH}/mediaexport.sh "import" "${W_EXPORT_BASEDIR}Routes\\top-routes" "" "top-favorites" "all" "flat" "flat" "1" "showall" "" createhtml "route"
cp "${W_EXPORT_BASEDIR}Routes\\top-routes\\top-favorites.html" "${W_EXPORT_BASEDIR}Routes\\top-routes\\top-favorites-withimg.html"
${SCRIPTPATH}/setSkipMediaCheckForViewerFile.sh "${W_EXPORT_BASEDIR}Routes\\top-routes\\top-favorites-withimg.html" "true"

