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

# check parameters
if [ "$#" -lt 2 ]; then
    dofail "USAGE: export-pages-src.sh CONFIGPROFILE, SRCPREFIXDIR\nFATAL: requires CONFIGPROFILE, SRCPREFIXDIR as parameters 'import-XXXX'" 1
    exit 1
fi
CONFIGPROFILE=$1
SRCPREFIXDIR=$2

if [ ! -d "${SRCPREFIXDIR}" ]; then
    dofail "USAGE: export-pages-src.sh SRCPREFIXDIR\nFATAL: SRCPREFIXDIR must exists" 1
    exit 1
fi

source ${SCRIPTPATH}/configure-environment.bash

echo "start - export-pages-src for ${CONFIGPROFILE} to ${SRCPREFIXDIR}"

# src pdocs
mkdir -p "${SRCPREFIXDIR}src/frontend/assets/staticdata/"
${SCRIPTPATH}/exportPDocs.sh ${CONFIGPROFILE} "${SRCPREFIXDIR}src/frontend/assets/" "pdocs" "lang_de" "profile_static"
node dist/backend/serverAdmin.js\
     --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
     --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
     --command pageManager\
     --action exportPDocViewerFile\
     --exportName "static.mytbpdocs"\
     --exportDir "${SRCPREFIXDIR}src/frontend/assets/staticdata/"\
     --exportId "assets/staticdata/static.mytbpdocs.js"\
     --profiles "profile_viewer" \
     --langkeys "lang_de" \
     --debug 1

echo "done - export-pages-src for ${CONFIGPROFILE} to ${SRCPREFIXDIR}"
