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
if [ "$#" -lt 1 ]; then
    dofail "USAGE: import-geodata.sh POIIMPORTDIR\nFATAL: requires 1 parameters " 1
    exit 1
fi

echo "now: configure linux vars: run sbin/configure-environment.sh"
source ${SCRIPTPATH}/configure-environment.bash

POIIMPORTDIR=${1}

cd ${MYTB}

if [ ! -d "${POIIMPORTDIR}" ]; then
    dofail "USAGE:  import-geodata.sh POIIMPORTDIR\nFATAL: POIIMPORTDIR: ${POIIMPORTDIR} not exists " 1
fi

for DATAFILE in ${POIIMPORTDIR}/*.geojson; do
 echo "CONVERTING ${DATAFILE} -> ${DATAFILE}.json"
 node dist/backend/serverAdmin.js\
      --debug\
      --command convertTourDoc\
      --action convertGeoJsonToTourDoc\
      --adminclibackend config/adminCli.dev.json\
      --backend config/backend.dev.json\
      --renameFileIfExists true\
      --mode RESPONSE\
      --file ${DATAFILE}.json\
      --srcFile ${DATAFILE}
 echo "IMPORTING ${DATAFILE}.json"
 node dist/backend/serverAdmin.js\
      --debug\
      --command loadTourDoc\
      --action loadDocs\
      --adminclibackend config/adminCli.dev.json\
      --backend config/backend.dev.json\
      --renameFileAfterSuccess true\
      --file ${DATAFILE}.json
done

cd $CWD
