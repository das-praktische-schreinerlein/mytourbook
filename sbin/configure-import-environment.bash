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
if [ "$#" -ne 1 ]; then
    dofail "USAGE: configure-common-environment.sh IMPORTKEY\nFATAL: requires 'IMPORTKEY' as parameters 'import-XXXX'" 1
    exit 1
fi
IMPORTKEY=$1

echo "start - configure import environment: '${IMPORTKEY}'"

source ${SCRIPTPATH}/configure-environment.bash

BASEDIR=${MYTB_IMPORT_MEDIADIR}
W_BASEDIR="${W_MYTB_IMPORT_MEDIADIR}"

IMPORTKEY_BASEDIR=${BASEDIR}/${IMPORTKEY}
IMPORT_BASEDIR=${IMPORTKEY_BASEDIR}/import/
IMPORT_BASEDIR_SRC=${IMPORT_BASEDIR}/SOURCE/
IMPORT_BASEDIR_IMAGES=${IMPORT_BASEDIR}/images/
IMPORT_BASEDIR_VIDEOS=${IMPORT_BASEDIR}/videos/
IMPORT_BASEDIR_IMAGES_GROUPED=${IMPORT_BASEDIR_IMAGES}/GROUPED/
IMPORT_BASEDIR_IMAGES_READY=${IMPORT_BASEDIR_IMAGES}/READY/
IMPORT_BASEDIR_VIDEOS_READY=${IMPORT_BASEDIR_VIDEOS}/READY/
IMPORT_BASEDIR_DONE=${IMPORTKEY_BASEDIR}/archive/

W_IMPORTKEY_BASEDIR="${W_BASEDIR}\\${IMPORTKEY}"
W_IMPORT_BASEDIR="${W_IMPORTKEY_BASEDIR}\\import\\"
W_IMPORT_BASEDIR_SRC="${W_IMPORTKEY_BASEDIR}\\SOURCE\\"
W_IMPORT_BASEDIR_IMAGES="${W_IMPORT_BASEDIR}\\images\\"
W_IMPORT_BASEDIR_VIDEOS="${W_IMPORT_BASEDIR}\\videos\\"
W_IMPORT_BASEDIR_IMAGES_READY="${W_IMPORT_BASEDIR_IMAGES}\\READY"

echo "done - configure import environment: '${IMPORTKEY}'"
