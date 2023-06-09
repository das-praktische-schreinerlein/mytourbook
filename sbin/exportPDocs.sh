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
if [ "$#" -lt 5 ]; then
    dofail "USAGE: exportPDocs.sh CONFIGPROFILE EXPORTDIR EXPORTNAME LANGKEYS PROFILES\nFATAL: requires CONFIGPROFILE EXPORTDIR EXPORTNAME LANGKEYS PROFILES as parameters 'import-XXXX'" 1
    exit 1
fi
CONFIGPROFILE=$1
EXPORTDIR=$2
EXPORTNAME=$3
LANGKEYS=$4
PROFILES=$5

source ${SCRIPTPATH}/configure-environment.bash

if [ ! -d "${EXPORTDIR}" ]; then
    dofail "USAGE: exportPDocs.sh EXPORTDIR\nFATAL: $EXPORTDIR must exists" 1
    exit 1
fi

echo "start - generate ${EXPORTDIR}/${EXPORTNAME}.json for ${LANGKEYS} ${PROFILES}"
cd ${MYTB}
node dist/backend/serverAdmin.js\
     --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
     --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
     --command pageManager\
     --action exportPDocFile\
     --exportName ${EXPORTNAME}\
     --exportDir ${EXPORTDIR}\
     --profiles ${PROFILES} \
     --langkeys ${LANGKEYS} \
     --debug 1

echo "done - generate ${EXPORTDIR}/${EXPORTNAME}.json for ${LANGKEYS} ${PROFILES}"
