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
    dofail "USAGE: prepare-track-import importKey\nFATAL: requires 'importKey' as parameters 'import-XXXX'" 1
    exit 1
fi
IMPORTKEY=$1

echo "now: configure linux vars: run configure-environment.bash"
source ${SCRIPTPATH}/configure-environment.bash

if [ ! -d "${MYTB_IMPORT_MEDIADIR}${IMPORTKEY}" ]; then
  echo "FATAL: import-directory '${MYTB_IMPORT_MEDIADIR}${IMPORTKEY} must exist"
  exit 1
fi

echo "now: create symlink so that this folder is the current import-folder'import ${IMPORTKEY}'"
cd $MYTB_IMPORT_MEDIADIR
unlink import || echo ""
${MYTB}/node_modules/.bin/symlink-dir ${IMPORTKEY} import
cd $CWD
