#!/bin/bash
# exit on error
set -e
CWD=$(pwd)
function dofail {
    cd $CWD
    printf '%s\n' "$1" >&2  ## Send message to stderr. Exclude >&2 if you don't want it that way.
    exit "${2-1}"  ## Return a code specified by $2 or 1 by default.
}

echo "start - indexing mytb-images"
LIREINDEXER_NUMTHREADS=8
LIREINDEXER_FEATURES=CEDD,FCTH,OpponentHistogram,ColorLayout,JCD,SimpleColorHistogram

echo "now: configure linux vars: run sbin/configure-environment.sh"
source ./configure-environment.bash

echo "now: running indexing mytb-images from '$W_MYTB_INDEXSRC_MEDIADIR' to '$W_MYTB_INDEXDIR'"
${LIRETOOLS}/sbin/indexImages.sh "$W_MYTB_INDEXSRC_MEDIADIR" "$W_MYTB_INDEXDIR" "$LIREINDEXER_FEATURES" "$LIREINDEXER_NUMTHREADS"
cd ${CWD}

echo "done - indexing mytb-images"
