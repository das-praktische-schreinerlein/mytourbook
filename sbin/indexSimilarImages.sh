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

echo "start - indexing mytb-images"
LIRESEARCHER_NUMTHREADS=8
LIRESEARCHER_FEATURES=OpponentHistogram,ColorLayout,SimpleColorHistogram
LIRESEARCHER_MAXDIFFERENCESCORE=30
LIRESEARCHER_SHOWSIMILARHITS=20

echo "now: configure linux vars: run sbin/configure-environment.sh"
source ${SCRIPTPATH}/configure-environment.bash

echo "now: running indexing similar mytb-images in '$W_MYTB_INDEXDIR'"
cd ${LIRETOOLS}/sbin
${LIRETOOLS}/sbin/indexSimilarImages.sh "$MYTB_INDEXSRC_MEDIADIR" "$W_MYTB_INDEXDIR" "$LIRESEARCHER_FEATURES" "$LIRESEARCHER_MAXDIFFERENCESCORE" "$LIRESEARCHER_SHOWSIMILARHITS" "$LIRESEARCHER_NUMTHREADS"
cd ${CWD}

echo "done - indexing similar mytb-images"
