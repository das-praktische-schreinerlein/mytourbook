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
    dofail "USAGE: dataexport.playlist.sh EXPORTDIR [PLAYLISTNAME PLAYLISTFILE RESOLUTIONPROFILE DIPROFILE FILEPROFILE] \nFATAL: requires 1 parameters " 1
    exit 1
fi

EXPORTDIR=$1
PLAYLISTNAME=$2
PLAYLISTFILE=${3:-${PLAYLISTNAME}}
RESOLUTIONPROFILE=${4:-default}
DIPROFILE=${5:-default}
FILEPROFILE=${6:-default}

# check parameters
if [ ! -d "${EXPORTDIR}" ]; then
    dofail "USAGE: dataexport.playlist.sh EXPORTDIR \nFATAL: EXPORTDIR not exists " 1
fi
if [ -d "${EXPORTDIR}/${PLAYLISTFILE}" ]; then
    dofail "USAGE: dataexport.playlist.sh EXPORTDIR PLAYLISTNAME PLAYLISTFILE \nFATAL: PLAYLISTFILE is directory " 1
fi

echo "start - prepare file export: playlist='${PLAYLISTNAME}' to '${EXPORTDIR}' fileBase='${PLAYLISTFILE}' directoryProfile='${DIPROFILE}' fileNameProfile='${FILEPROFILE}'"

echo "now: configure linux vars: run sbin/configure-environment.sh"
source ${SCRIPTPATH}/configure-environment.bash

if [ "${AUTOSTARTEXPORT}" != "true" ]; then
  echo "OPEN: Do you want to start image export: playlist='${PLAYLISTNAME}' to '${EXPORTDIR}' m3u='${PLAYLISTFILE}'  directoryProfile='${DIPROFILE}' fileNameProfile='${FILEPROFILE}'?"
  select yn in "Yes" "No"; do
      case $yn in
          Yes ) break;;
          No ) exit;;
      esac
  done
fi

echo "now: generate export"
cd ${MYTB}
node dist/backend/serverAdmin.js --debug --command mediaManager --action exportImageFiles  -c ${CONFIG_BASEDIR}backend.json --exportDir "$EXPORTDIR" --directoryProfile ${DIPROFILE} --fileNameProfile ${FILEPROFILE} --resolutionProfile ${RESOLUTIONPROFILE} --parallel 20 --playlists "${PLAYLISTNAME}" --exportName "${PLAYLISTFILE}-images"
node dist/backend/serverAdmin.js --debug --command mediaManager --action exportVideoFiles  -c ${CONFIG_BASEDIR}backend.json --exportDir "$EXPORTDIR" --directoryProfile ${DIPROFILE} --fileNameProfile ${FILEPROFILE} --resolutionProfile ${RESOLUTIONPROFILE} --parallel 20 --playlists "${PLAYLISTNAME}" --exportName "${PLAYLISTFILE}-videos"

echo "done - file export: playlist='${PLAYLISTNAME}' to '${EXPORTDIR}' fileBase='${PLAYLISTFILE}'"
