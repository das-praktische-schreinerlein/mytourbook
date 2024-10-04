#!/bin/bash
# exit on error
set -e
CWD=$(pwd)
SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
function dofail {
    cd $CWD
    printf '%s\n' "$1" >&2  ## Send message to stderr. Exclude >&2 if you don't want it that way.
    exit "${2-1}"  ## Return a code specified by $2 or 1 by default.
}

function join_by { local IFS="$1"; shift; echo "$*"; };

echo "now: configure linux vars: run sbin/configure-environment.sh"
source ${SCRIPTPATH}/configure-environment.bash

EXPORTSUBDIR=${1:-Bilder-flat}
DIPROFILE=${2:-flat}
FILEPROFILE=${3:-flat}
PERSONEXPORTPROFILE=${4:-all}
VIEWERSRC=${5:-${SCRIPTPATH}/../dist/static/mytbviewer/de/index.viewer.full.html}
PDFVIEWERSRC=${SCRIPTPATH}/../dist/static/mytbviewer/de-with-pdf/index.viewer.full.html

${SCRIPTPATH}/mediaexport.sh "import" "${W_EXPORT_BASEDIR}Bilder-flat\\top-favorites" "" "top-favorites" "all" "flat" "flat" "2" "showall" "" createhtml
#${SCRIPTPATH}/mediaexport.sh "prod" "${W_EXPORT_BASEDIR}Bilder\\prod-favorites" "Favorites" "favorites" "prod" "default" "default" "2" "nonblocked_me" ""

${SCRIPTPATH}/mediaexport.sh "dev" "${W_EXPORT_BASEDIR}Routes\\" "" "gardasee" "prod" "flat" "flat" "" "nonblocked_innerfamily" "" createhtml "route" "" "" "Gardasee" ${PDFVIEWERSRC}


${SCRIPTPATH}/mediaexport.sh "import" "${W_EXPORT_BASEDIR}Routes\\top-routes" "" "top-favorites" "all" "flat" "flat" "1" "showall" "" createhtml "route"
${SCRIPTPATH}/setConfigValueInViewerFile.sh "${W_EXPORT_BASEDIR}Routes\\top-routes\\top-favorites.html" "bestMatchingTabsOrder" '"ROUTE","DESTINATION","LOCATION","POI","INFO","PLAYLIST","ALL"'
${SCRIPTPATH}/setConfigValueInViewerFile.sh "${W_EXPORT_BASEDIR}Routes\\top-routes\\top-favorites.html" "favoritesTabsOrder" '"ROUTE", "DESTINATION", "ALL"'
${SCRIPTPATH}/exportPDocs.sh "import" "${W_EXPORT_BASEDIR}Routes\\top-routes" "top-favorites-pdocs" "lang_de" "profile_viewer"
${SCRIPTPATH}/setPDocsInViewerFile.sh "import" "${W_EXPORT_BASEDIR}Routes\\top-routes\top-favorites.html" "${W_EXPORT_BASEDIR}Routes\\top-routes\\top-favorites-pdocs.json"
cp "${W_EXPORT_BASEDIR}Routes\\top-routes\\top-favorites.html" "${W_EXPORT_BASEDIR}Routes\\top-routes\\top-favorites-withimg.html"
${SCRIPTPATH}/setConfigValueInViewerFile.sh "${W_EXPORT_BASEDIR}Routes\\top-routes\\top-favorites-withimg.html" "skipMediaCheck" "true"

