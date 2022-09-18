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
    dofail "USAGE: setSkipMediaCheckForViewerFile.sh VIEWERFILE SKIPMEDIACHECK\nFATAL: requires VIEWERFILE as parameters 'import-XXXX'" 1
    exit 1
fi
VIEWERFILE=$1
SKIPMEDIACHECK=$2

if [ ! -f "${VIEWERFILE}" ]; then
    dofail "USAGE: setSkipMediaCheckForViewerFile.sh VIEWERFILE\nFATAL: VIEWERFILE $VIEWERFILE must exists" 1
    exit 1
fi

echo "start - preparing $VIEWERFILE with SKIPMEDIACHECK=${SKIPMEDIACHECK}"

DIR="$( cd "$(dirname "$VIEWERFILE")" >/dev/null 2>&1 ; pwd -P )"
FILE="$(basename ${VIEWERFILE})"
cd $DIR
sed -i "s/\"skipMediaCheck\": false/\"skipMediaCheck\": ${SKIPMEDIACHECK}/"  ${FILE}
sed -i "s/\"skipMediaCheck\": true/\"skipMediaCheck\": ${SKIPMEDIACHECK}/"  ${FILE}
cd ${CWD}

echo "done - preparing $VIEWERFILE with SKIPMEDIACHECK=${SKIPMEDIACHECK}"
