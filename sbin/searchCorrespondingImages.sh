#!/bin/bash
# exit on error
set -e
CWD=$(pwd)
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
source ./configure-environment.bash

echo "now: check search-folder"
if [ ! -d "${SEARCHDIR}" ]; then
    dofail "USAGE: searchCorrespondingImages.sh SEARCHDIR USESIMILARITYINDEX\nFATAL: requires 'SEARCHDIR' as parameters 'import-XXXX'" 1
    exit 1
fi

if [ "${USESIMILARITYINDEX}" != "" ]; then
    echo "now: check image with image-index: ${SEARCHDIR}"
    cd ${LIRETOOLS}
    ./gradlew runSearch --args="-i $SEARCHDIR -l $W_MYTB_INDEXDIR -m $LIRESEARCHER_MAXDIFFERENCESCORE -n $LIRESEARCHER_NUMTHREADS -f $LIRESEARCHER_FEATURES" > $SEARCHDIR/findFilesInLireIndex.tmp && sed -e '/BUILD SUCCESSFUL/,$d' $SEARCHDIR/findFilesInLireIndex.tmp | sed -e '1,/Getting all images in/d' > $SEARCHDIR/findFilesInLireIndex.json
    cd ${CWD}
    echo "now: check images and image-index-result with database: ${SEARCHDIR}"
    cd ${MYTB}
    node dist/backend/serverAdmin.js --command mediaManager --action findCorrespondingTourDocRecordsForMedia --importDir $SEARCHDIR  --additionalMappingsFile $SEARCHDIR/findFilesInLireIndex.json --debug true > $SEARCHDIR/findFilesInDb.tmp && sed -e '/DONE - command finished/,$d' $SEARCHDIR/findFilesInDb.tmp > $SEARCHDIR/findFilesInDb.json
    cd ${CWD}
else
    echo "now: check images with database: ${SEARCHDIR}"
    cd ${MYTB}
    node dist/backend/serverAdmin.js --command mediaManager --action findCorrespondingTourDocRecordsForMedia --importDir $SEARCHDIR  --debug true > $SEARCHDIR/findFilesInDb.tmp && sed -e '/DONE - command finished/,$d' $SEARCHDIR/findFilesInDb.tmp > $SEARCHDIR/findFilesInDb.json
    cd ${CWD}
fi

echo "done - find correspnding mytb-images for images in search-folder: ${SEARCHDIR}'"
