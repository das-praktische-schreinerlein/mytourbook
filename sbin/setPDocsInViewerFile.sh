#!/bin/bash
# exit on error
set -e
CWD=$(pwd)
SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
AVAILABLE_PROFILES=("skipMediaCheck" "pageContainerOrder" "bestMatchingTabsOrder" "favoritesTabsOrder")

function dofail {
    cd $CWD
    printf '%s\n' "$1" >&2  ## Send message to stderr. Exclude >&2 if you don't want it that way.
    exit "${2-1}"  ## Return a code specified by $2 or 1 by default.
}

# check parameters
if [ "$#" -lt 3 ]; then
    dofail "USAGE: setPDocsInViewerFile.sh CONFIGPROFILE VIEWERFILE PDOCFILE\nFATAL: requires CONFIGPROFILE VIEWERFILE PDOCFILE as parameters 'import-XXXX'" 1
    exit 1
fi

CONFIGPROFILE=$1
VIEWERFILE=$2
PDOCFILE=$3

source ${SCRIPTPATH}/configure-environment.bash

if [ ! -f "${VIEWERFILE}" ]; then
    dofail "USAGE: setPDocsInViewerFile.sh VIEWERFILE\nFATAL: VIEWERFILE $VIEWERFILE must exists" 1
    exit 1
fi

echo "start - setPDocsInViewerFile ${VIEWERFILE} with ${PDOCFILE}"
cd ${MYTB}
node dist/backend/serverAdmin.js\
     --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
     --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
     --command mediaManager\
     --action setPDocsInViewerFile\
     --srcFile ${VIEWERFILE} \
     --pdocFile ${PDOCFILE} \
     --debug 1

echo "inline all ${VIEWERFILE}.html"
node dist/backend/serverAdmin.js\
     --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
     --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
     --command mediaManager\
     --action inlineDataOnViewerFile\
     --srcFile ${VIEWERFILE}\
     --debug 1
cd ${CWD}

echo "done - setPDocsInViewerFile  ${VIEWERFILE} with ${PDOCFILE}"
