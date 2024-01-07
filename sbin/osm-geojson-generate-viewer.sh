#!/bin/bash
# exit on error
set -e
CWD=$(pwd)
SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

echo "now: configure linux vars: run sbin/configure-environment.sh"
source ${SCRIPTPATH}/configure-environment.bash

VIEWERSRC=${SCRIPTPATH}/../dist/static/mytbviewer/de-with-pdf/index.viewer.full.html

echo "run generate osm-viewer for dir: ${OSMDIR}"
FILTER=$OSMDIR/*.tdoc.json
FILES=`echo $FILTER | sed "s/ /,/g"`

echo "run generate osm-viewer for files: ${FILES}"
${SCRIPTPATH}/generateViewerFileForStaticData.sh ${OSMDIR}/ $FILES mytb-pois ${VIEWERSRC}
${SCRIPTPATH}/setConfigValueInViewerFile.sh "${W_OSMDIR}\\mytb-pois.html" "bestMatchingTabsOrder" '"POI","INFO"'
${SCRIPTPATH}/setConfigValueInViewerFile.sh "${W_OSMDIR}\\mytb-pois.html" "favoritesTabsOrder" '"POI"'

echo "done generate osm-viewer for fiels: ${FILES}"
