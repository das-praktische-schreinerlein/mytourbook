#!/bin/bash
# exit on error
set -e
CWD=$(pwd)
SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

function join_by { local IFS="$1"; shift; echo "$*"; };

echo "now: configure linux vars: run sbin/configure-environment.sh"
source ${SCRIPTPATH}/configure-environment.bash

CONFIGPROFILE=${1:-dev}
ROUTEDIR=${2}
ROUTEFILEBASE=${3:-all}
DIPROFILE=${4:-flat}
FILEPROFILE=${5:-flat}
FULLTEXRFILTER=${6}
ACTIONTYPES=${7}
PERSONS=${8}
WHEREFILTER=${9}
VIEWERSRC=${10}

# Routes
${SCRIPTPATH}/mediaexport.sh "${CONFIGPROFILE}" "${ROUTEDIR}" "" "${ROUTEFILEBASE}" "prod" "${DIPROFILE}" "${FILEPROFILE}" "" "nonblocked_innerfamily" "${FULLTEXRFILTER}" createhtml "route" "${ACTIONTYPES}" "${PERSONS}" "${WHEREFILTER}" "${VIEWERSRC}"
${SCRIPTPATH}/setConfigValueInViewerFile.sh "${ROUTEDIR}\\${ROUTEFILEBASE}.html" "bestMatchingTabsOrder" '"ROUTE","DESTINATION","LOCATION","POI","INFO","PLAYLIST","ALL"'
${SCRIPTPATH}/setConfigValueInViewerFile.sh "${ROUTEDIR}\\${ROUTEFILEBASE}.html" "favoritesTabsOrder" '"ROUTE", "DESTINATION", "ALL"'
cp "${ROUTEDIR}\\${ROUTEFILEBASE}.html" "${ROUTEDIR}\\routes-${ROUTEFILEBASE}-noimg.html"
cp "${ROUTEDIR}\\${ROUTEFILEBASE}.html" "${ROUTEDIR}\\routes-${ROUTEFILEBASE}-withimg.html"
${SCRIPTPATH}/setConfigValueInViewerFile.sh "${ROUTEDIR}\\routes-${ROUTEFILEBASE}-withimg.html" "skipMediaCheck" "true"

