#!/bin/bash
# exit on error
set -e
CWD=$(pwd)
function dofail {
    cd $CWD
    printf '%s\n' "$1" >&2  ## Send message to stderr. Exclude >&2 if you don't want it that way.
    exit "${2-1}"  ## Return a code specified by $2 or 1 by default.
}

echo "start - index mytb-images"
LIREINDEXER_NUMTHREADS=8
LIREINDEXER_FEATURES=CEDD,FCTH,OpponentHistogram,ColorLayout,JCD,SimpleColorHistogram

echo "now: configure linux vars: run sbin/configure-environment.sh"
source ./configure-environment.bash

echo "now: running indexing images from '$W_MYTB_INDEXSRC_MEDIADIR' to '$MYTB_INDEXDIR'"
cd ${LIRETOOLS}
./gradlew runIndexing --args="-i $W_MYTB_INDEXSRC_MEDIADIR -l $MYTB_INDEXDIR -n $LIREINDEXER_NUMTHREADS -f $LIREINDEXER_FEATURES"
cd ${CWD}

echo "done - index mytb-images"
