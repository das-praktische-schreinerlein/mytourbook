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
    dofail "USAGE: setConfigValueInViewerFile.sh VIEWERFILE PROFILE VALUE\nFATAL: requires VIEWERFILE PROFILE VALUE as parameters 'import-XXXX'" 1
    exit 1
fi
VIEWERFILE=$1
PROFILE=$2
VALUE=$3

if [ ! -f "${VIEWERFILE}" ]; then
    dofail "USAGE: setConfigValueInViewerFile.sh VIEWERFILE\nFATAL: VIEWERFILE $VIEWERFILE must exists" 1
    exit 1
fi

FOUND=false
for e in "${AVAILABLE_PROFILES[@]}"; do
    [[ "$e" == "${PROFILE}" ]] && FOUND=true;
done;
if [ $FOUND = false ]; then
     PROFILESTRING="${AVAILABLE_PROFILES[@]}"
     dofail "USAGE: setConfigValueInViewerFile.sh PROFILE\nFATAL: PROFILE must exists in ${PROFILESTRING}" 1
     exit 1
fi

echo "do - preparing $VIEWERFILE for profile ${PROFILE}='${VALUE}'"


DIR="$( cd "$(dirname "$VIEWERFILE")" >/dev/null 2>&1 ; pwd -P )"
FILE="$(basename ${VIEWERFILE})"
cd $DIR

# regexp non-gready seen at https://0x2a.at/blog/2008/07/sed--non-greedy-matching/
if [ "${PROFILE}" = "skipMediaCheck" ]; then
  sed -i "s/\"skipMediaCheck\": false/\"skipMediaCheck\": ${VALUE}/m"  ${FILE}
  sed -i "s/\"skipMediaCheck\": true/\"skipMediaCheck\": ${VALUE}/m"  ${FILE}
elif [ "${PROFILE}" = "pageContainerOrder" ]; then
  sed -i "s/\"pageContainerOrder\": [^]]*]/\"pageContainerOrder\": [${VALUE}]/m"  ${FILE}
elif [ "${PROFILE}" = "bestMatchingTabsOrder" ]; then
  sed -i "s/\"bestMatchingTabsOrder\": [^]]*]/\"bestMatchingTabsOrder\": [${VALUE}]/m"  ${FILE}
elif [ "${PROFILE}" = "favoritesTabsOrder" ]; then
  sed -i "s/\"favoritesTabsOrder\": [^]]*]/\"favoritesTabsOrder\": [${VALUE}]/m"  ${FILE}
fi

cd ${CWD}

echo "done - preparing $VIEWERFILE for profile ${PROFILE}='${VALUE}'"
