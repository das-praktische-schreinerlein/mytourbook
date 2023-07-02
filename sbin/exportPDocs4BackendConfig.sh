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
    dofail "USAGE: export-pages-backend.sh CONFIGPROFILE, EXPORTDIR, LANGKEY\nFATAL: requires CONFIGPROFILE, EXPORTDIR, LANGKEY as parameters 'import-XXXX'" 1
    exit 1
fi
CONFIGPROFILE=$1
EXPORTDIR=$2
LANGKEY=$3

if [ ! -d "${EXPORTDIR}" ]; then
    dofail "USAGE: export-pages-backend.sh EXPORTDIR\nFATAL: $EXPORTDIR must exists" 1
    exit 1
fi

source ${SCRIPTPATH}/configure-environment.bash

echo "start - export-pages-backend for ${CONFIGPROFILE} to ${EXPORTDIR}"

# backend pdocs
${SCRIPTPATH}/exportPDocs.sh ${CONFIGPROFILE} "${EXPORTDIR}" "pdocs-${LANGKEY}" "lang_${LANGKEY}" "profile_import,profile_dev,profile_beta,profile_prod"
${SCRIPTPATH}/exportPDocs.sh ${CONFIGPROFILE} "${EXPORTDIR}" "pdocs-import-${LANGKEY}" "lang_${LANGKEY}" "profile_import"
${SCRIPTPATH}/exportPDocs.sh ${CONFIGPROFILE} "${EXPORTDIR}" "pdocs-dev-${LANGKEY}" "lang_${LANGKEY}" "profile_dev"
${SCRIPTPATH}/exportPDocs.sh ${CONFIGPROFILE} "${EXPORTDIR}" "pdocs-beta-${LANGKEY}" "lang_${LANGKEY}" "profile_beta"
${SCRIPTPATH}/exportPDocs.sh ${CONFIGPROFILE} "${EXPORTDIR}" "pdocs-prod-${LANGKEY}" "lang_${LANGKEY}" "profile_prod"

echo "done - export-pages-backend for ${CONFIGPROFILE} to ${EXPORTDIR}"
