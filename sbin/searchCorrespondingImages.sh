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
    dofail "USAGE: searchCorrespondingImages.sh SEARCHDIR USESIMILARITYINDEX\nFATAL: requires 'SEARCHDIR' as parameters 'import-XXXX'" 1
    exit 1
fi
SEARCHDIR=$1
USESIMILARITYINDEX=$2

echo "start - find corresponding mytb-images for images in search-folder: ${SEARCHDIR}"
LIRESEARCHER_NUMTHREADS=8
LIRESEARCHER_FEATURES=OpponentHistogram,ColorLayout,SimpleColorHistogram
LIRESEARCHER_MAXDIFFERENCESCORE=8

echo "now: configure linux vars: run sbin/configure-environment.sh"
source ${SCRIPTPATH}/configure-environment.bash

echo "now: check search-folder"
if [ ! -d "${SEARCHDIR}" ]; then
    dofail "USAGE: searchCorrespondingImages.sh SEARCHDIR USESIMILARITYINDEX\nFATAL: requires 'SEARCHDIR' as parameters 'import-XXXX'" 1
    exit 1
fi

rm -f "$SEARCHDIR/findFilesInLireIndex.log"
rm -f "$SEARCHDIR/findFilesInLireIndex.json"
rm -f "$SEARCHDIR/findFilesInDb.log"
rm -f "$SEARCHDIR/findFilesInDb.json"
if [ "${USESIMILARITYINDEX}" != "" ]; then
    echo "now: check image with image-index: ${SEARCHDIR}"
    cd ${LIRETOOLS}/sbin
    ${LIRETOOLS}/sbin/searchIndexedImages.sh "$SEARCHDIR" "$W_MYTB_INDEXDIR" "$LIRESEARCHER_FEATURES" "$LIRESEARCHER_MAXDIFFERENCESCORE" "1" "$LIRESEARCHER_NUMTHREADS"
    cd ${CWD}
    echo "now: check images and image-index-result with database: ${SEARCHDIR}"
    cd ${MYTB}

    node dist/backend/serverAdmin.js --adminclibackend ${CONFIG_BASEDIR}adminCli.dev.json --backend ${CONFIG_BASEDIR}backend.dev.json --command mediaManager --action findCorrespondingTourDocRecordsForMedia --importDir $SEARCHDIR  --additionalMappingsFile $SEARCHDIR/findFilesInLireIndex.json --debug true --outputFile $SEARCHDIR/findFilesInDb.json > "$SEARCHDIR/findFilesInDb.log"
    cd ${CWD}
else
    echo "now: check images with database: ${SEARCHDIR}"
    cd ${MYTB}
    node dist/backend/serverAdmin.js --adminclibackend ${CONFIG_BASEDIR}adminCli.dev.json --backend ${CONFIG_BASEDIR}backend.dev.json --command mediaManager --action findCorrespondingTourDocRecordsForMedia --importDir $SEARCHDIR  --debug true --outputFile $SEARCHDIR/findFilesInDb.json > "$SEARCHDIR/findFilesInDb.log"
    cd ${CWD}
fi
rm -f "$SEARCHDIR/findFilesInLireIndex.tmp"
rm -f "$SEARCHDIR/findFilesInDb.tmp"

echo "done - find correspnding mytb-images for images in search-folder: '${SEARCHDIR}'"
