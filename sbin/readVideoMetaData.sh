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
    dofail "USAGE: readVideoMetaData.sh CONFIGPROFILE] \nFATAL: requires 1 parameters " 1
    exit 1
fi

CONFIGPROFILE=${1}
FORCE=${2:-false}

echo "now: configure linux vars: run sbin/configure-environment.sh"
source ${SCRIPTPATH}/configure-environment.bash

# check parameters
cd ${MYTB}
CONFGFILE="${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json"
if [ ! -f "${CONFGFILE}" ]; then
    dofail "USAGE: readVideoMetaData.sh CONFIGPROFILE\nFATAL: CONFGFILE not exists '${CONFGFILE}' " 1
fi
CLICONFGFILE="${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json"
if [ ! -f "${CLICONFGFILE}" ]; then
    dofail "USAGE: readVideoMetaData.sh CONFIGPROFILE \nFATAL: CLICONFGFILE not exists '${CLICONFGFILE}' " 1
fi

echo "start - readVideoMetaData configProfile='${CONFIGPROFILE}'"
cd ${MYTB}

node dist/backend/serverAdmin.js\
    --debug 10\
    --command mediaManager\
    --action readVideoMetaData\
    --adminclibackend "${CLICONFGFILE}"\
    --backend "${CONFGFILE}"\
    --force "${FORCE}"\
    --parallel 1


echo "done - readVideoMetaData configProfile='${CONFIGPROFILE}'"
