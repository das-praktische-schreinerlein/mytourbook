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
    dofail "USAGE: dataexport.playlist.sh EXPORTDIR [PLAYLISTNAMEFILTER PLAYLISTFILE RESOLUTIONPROFILE DIPROFILE FILEPROFILE CONFIGPROFILE RATEMINFILTER BLOCKEDFILTER] \nFATAL: requires 1 parameters " 1
    exit 1
fi

EXPORTDIR=$1
PLAYLISTNAMEFILTER=$2
PLAYLISTFILE=${3:-${PLAYLISTNAMEFILTER}}
RESOLUTIONPROFILE=${4:-default}
DIPROFILE=${5:-default}
FILEPROFILE=${6:-default}
CONFIGPROFILE=${7}
RATEMINFILTER=${8}
SHOWNONBLOCKEDONLY=${9:showall}

# check parameters
if [ ! -d "${EXPORTDIR}" ]; then
    dofail "USAGE: dataexport.playlist.sh EXPORTDIR \nFATAL: EXPORTDIR not exists " 1
fi
if [ -d "${EXPORTDIR}/${PLAYLISTFILE}" ]; then
    dofail "USAGE: dataexport.playlist.sh EXPORTDIR PLAYLISTNAMEFILTER PLAYLISTFILE \nFATAL: PLAYLISTFILE is directory " 1
fi

echo "start - prepare file export: playlist='${PLAYLISTNAMEFILTER}' to '${EXPORTDIR}' fileBase='${PLAYLISTFILE}' directoryProfile='${DIPROFILE}' fileNameProfile='${FILEPROFILE}'"

echo "now: configure linux vars: run sbin/configure-environment.sh"
source ${SCRIPTPATH}/configure-environment.bash

# check parameters
CONFGFILE=${CONFIG_BASEDIR}backend.json
if [ "${CONFIGPROFILE}" != "" ]; then
    CONFGFILE="${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json"
fi
if [ ! -f "${CONFGFILE}" ]; then
    dofail "USAGE: dataexport.playlist.sh EXPORTDIR PLAYLISTNAMEFILTER PLAYLISTFILE RESOLUTIONPROFILE DIPROFILE FILEPROFILE CONFIGPROFILE \nFATAL: CONFGFILE not exists '${CONFGFILE}' " 1
fi

if [ "${AUTOSTARTEXPORT}" != "true" ]; then
  echo "OPEN: Do you want to start image export: playlist='${PLAYLISTNAMEFILTER}' to '${EXPORTDIR}' m3u='${PLAYLISTFILE}'  directoryProfile='${DIPROFILE}' fileNameProfile='${FILEPROFILE}'?"
  select yn in "Yes" "No"; do
      case $yn in
          Yes ) break;;
          No ) exit;;
      esac
  done
fi

echo "now: generate export"
cd ${MYTB}
node dist/backend/serverAdmin.js --debug --command mediaManager --action exportImageFiles  --exportName "${PLAYLISTFILE}-images" -c "${CONFGFILE}" --exportDir "$EXPORTDIR" --directoryProfile "${DIPROFILE}" --fileNameProfile "${FILEPROFILE}" --resolutionProfile "${RESOLUTIONPROFILE}" --parallel 20 --playlists "${PLAYLISTNAMEFILTER}" --rateMinFilter "${RATEMINFILTER}" --showNonBlockedOnly ${SHOWNONBLOCKEDONLY}
node dist/backend/serverAdmin.js --debug --command mediaManager --action exportVideoFiles  --exportName "${PLAYLISTFILE}-videos" -c "${CONFGFILE}" --exportDir "$EXPORTDIR" --directoryProfile "${DIPROFILE}" --fileNameProfile "${FILEPROFILE}" --resolutionProfile "${RESOLUTIONPROFILE}" --parallel 20 --playlists "${PLAYLISTNAMEFILTER}" --rateMinFilter "${RATEMINFILTER}" --showNonBlockedOnly ${SHOWNONBLOCKEDONLY}

echo "done - file export: playlist='${PLAYLISTNAMEFILTER}' to '${EXPORTDIR}' fileBase='${PLAYLISTFILE}'"
