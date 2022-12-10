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
    dofail "USAGE: mediaexport.sh CONFIGPROFILE EXPORTDIR [PLAYLISTNAMEFILTER PLAYLISTFILE RESOLUTIONPROFILE DIPROFILE FILEPROFILE CONFIGPROFILE RATEMINFILTER BLOCKEDFILTER FULLTEXT CREATEHTML TYPES ACTIONTYPES PERSONS] \nFATAL: requires 2 parameters " 1
    exit 1
fi

CONFIGPROFILE=${1}
EXPORTDIR=$2
PLAYLISTNAMEFILTER=$3
PLAYLISTFILE=${4:-${PLAYLISTNAMEFILTER}}
RESOLUTIONPROFILE=${5:-default}
DIPROFILE=${6:-default}
FILEPROFILE=${7:-default}
RATEMINFILTER=${8}
SHOWNONBLOCKEDONLY=${9:-showall}
FULLTEXRFILTER=${10}
CREATEHTML=${11:-none}
TYPES=${12:-image,video}
ACTIONTYPES=${13}
PERSONS=${14}

echo "now: configure linux vars: run sbin/configure-environment.sh"
source ${SCRIPTPATH}/configure-environment.bash

# check parameters
cd ${MYTB}
if [ ! -d "${EXPORTDIR}" ]; then
    dofail "USAGE: mediaexport.sh CONFIGPROFILE EXPORTDIR [PLAYLISTNAMEFILTER PLAYLISTFILE RESOLUTIONPROFILE DIPROFILE FILEPROFILE CONFIGPROFILE RATEMINFILTER BLOCKEDFILTER FULLTEXT CREATEHTML TYPES ACTIONTYPES PERSONS]\nFATAL: EXPORTDIR: ${EXPORTDIR} not exists " 1
fi
if [ -d "${EXPORTDIR}/${PLAYLISTFILE}" ]; then
    dofail "USAGE: mediaexport.sh CONFIGPROFILE EXPORTDIR [PLAYLISTNAMEFILTER PLAYLISTFILE RESOLUTIONPROFILE DIPROFILE FILEPROFILE CONFIGPROFILE RATEMINFILTER BLOCKEDFILTER FULLTEXT CREATEHTML TYPES ACTIONTYPES PERSONS]\nFATAL: PLAYLISTFILE: ${EXPORTDIR}/${PLAYLISTFILE} is directory " 1
fi

CONFGFILE="${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json"
if [ ! -f "${CONFGFILE}" ]; then
    dofail "USAGE: mediaexport.sh CONFIGPROFILE EXPORTDIR [PLAYLISTNAMEFILTER PLAYLISTFILE RESOLUTIONPROFILE DIPROFILE FILEPROFILE CONFIGPROFILE RATEMINFILTER BLOCKEDFILTER FULLTEXT CREATEHTML TYPES ACTIONTYPES PERSONS]\nFATAL: CONFGFILE not exists '${CONFGFILE}' " 1
fi
CLICONFGFILE="${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json"
if [ ! -f "${CLICONFGFILE}" ]; then
    dofail "USAGE: mediaexport.sh CONFIGPROFILE EXPORTDIR [PLAYLISTNAMEFILTER PLAYLISTFILE RESOLUTIONPROFILE DIPROFILE FILEPROFILE CONFIGPROFILE RATEMINFILTER BLOCKEDFILTER FULLTEXT CREATEHTML TYPES ACTIONTYPES PERSONS]\nFATAL: CLICONFGFILE not exists '${CLICONFGFILE}' " 1
fi

echo "start - prepare file expor for types $TYPES: playlist='${PLAYLISTNAMEFILTER}' to '${EXPORTDIR}' fileBase='${PLAYLISTFILE}' directoryProfile='${DIPROFILE}' fileNameProfile='${FILEPROFILE}'"

if [ "${AUTOSTARTEXPORT}" != "true" ]; then
  echo "OPEN: Do you want to start media export: playlist='${PLAYLISTNAMEFILTER}' to '${EXPORTDIR}' m3u='${PLAYLISTFILE}'  directoryProfile='${DIPROFILE}' fileNameProfile='${FILEPROFILE}'?"
  select yn in "Yes" "No"; do
      case $yn in
          Yes ) break;;
          No ) exit;;
      esac
  done
fi

echo "now: generate export"
cd ${MYTB}

IFS=', ' read -r -a TYPESARR <<< "$TYPES"
DATAFILES=()
for TYPE in "${TYPESARR[@]}"
do
  echo "start export of $TYPE"
  if [ "${TYPE}" == "image" ]; then
    DATAFILEBASE="images"
    node dist/backend/serverAdmin.js\
           --debug\
           --command mediaManager\
           --action exportImageFiles\
           --exportName "${PLAYLISTFILE}-${DATAFILEBASE}"\
           --adminclibackend "${CLICONFGFILE}"\
           --backend "${CONFGFILE}"\
           --exportDir "$EXPORTDIR"\
           --directoryProfile "${DIPROFILE}"\
           --fileNameProfile "${FILEPROFILE}"\
           --resolutionProfile "${RESOLUTIONPROFILE}"\
           --parallel 20\
           --playlists "${PLAYLISTNAMEFILTER}"\
           --rateMinFilter "${RATEMINFILTER}"\
           --showNonBlockedOnly ${SHOWNONBLOCKEDONLY}\
           --fulltext "${FULLTEXRFILTER}"\
           --actiontype "${ACTIONTYPES}"\
           --persons "${PERSONS}"
  elif [ "${TYPE}" == "route" ]; then
    DATAFILEBASE="routes"
    node dist/backend/serverAdmin.js\
           --debug\
           --command mediaManager\
           --action exportRouteFiles\
           --exportName "${PLAYLISTFILE}-${DATAFILEBASE}"\
           --adminclibackend "${CLICONFGFILE}"\
           --backend "${CONFGFILE}"\
           --exportDir "$EXPORTDIR"\
           --directoryProfile "${DIPROFILE}"\
           --fileNameProfile "${FILEPROFILE}"\
           --resolutionProfile "${RESOLUTIONPROFILE}"\
           --parallel 20\
           --playlists "${PLAYLISTNAMEFILTER}"\
           --rateMinFilter "${RATEMINFILTER}"\
           --showNonBlockedOnly ${SHOWNONBLOCKEDONLY}\
           --fulltext "${FULLTEXRFILTER}"\
           --actiontype "${ACTIONTYPES}"\
           --persons "${PERSONS}"
  elif [ "${TYPE}" == "track" ]; then
    DATAFILEBASE="tracks"
    node dist/backend/serverAdmin.js\
           --debug\
           --command mediaManager\
           --action exportTrackFiles\
           --exportName "${PLAYLISTFILE}-${DATAFILEBASE}"\
           --adminclibackend "${CLICONFGFILE}"\
           --backend "${CONFGFILE}"\
           --exportDir "$EXPORTDIR"\
           --directoryProfile "${DIPROFILE}"\
           --fileNameProfile "${FILEPROFILE}"\
           --resolutionProfile "${RESOLUTIONPROFILE}"\
           --parallel 20\
           --playlists "${PLAYLISTNAMEFILTER}"\
           --rateMinFilter "${RATEMINFILTER}"\
           --showNonBlockedOnly ${SHOWNONBLOCKEDONLY}\
           --fulltext "${FULLTEXRFILTER}"\
           --actiontype "${ACTIONTYPES}"\
           --persons "${PERSONS}"
  elif [ "${TYPE}" == "video" ]; then
    DATAFILEBASE="videos"
    node dist/backend/serverAdmin.js\
           --debug\
           --command mediaManager\
           --action exportVideoFiles\
           --exportName "${PLAYLISTFILE}-${DATAFILEBASE}"\
           --adminclibackend "${CLICONFGFILE}"\
           --backend "${CONFGFILE}"\
           --exportDir "$EXPORTDIR"\
           --directoryProfile "${DIPROFILE}"\
           --fileNameProfile "${FILEPROFILE}"\
           --resolutionProfile "${RESOLUTIONPROFILE}"\
           --parallel 20\
           --playlists "${PLAYLISTNAMEFILTER}"\
           --rateMinFilter "${RATEMINFILTER}"\
           --showNonBlockedOnly ${SHOWNONBLOCKEDONLY}\
           --fulltext "${FULLTEXRFILTER}"\
           --actiontype "${ACTIONTYPES}"\
           --persons "${PERSONS}"
  else
    dofail "USAGE:mediaexport.sh CONFIGPROFILE EXPORTDIR [PLAYLISTNAMEFILTER PLAYLISTFILE RESOLUTIONPROFILE DIPROFILE FILEPROFILE CONFIGPROFILE RATEMINFILTER BLOCKEDFILTER FULLTEXT CREATEHTML TYPES ACTIONTYPES PERSONS]\nFATAL: TYPE: $TYPE not exists " 1
  fi

  DATAFILES+=("${EXPORTDIR}/${PLAYLISTFILE}-${DATAFILEBASE}.mdocexport.json")
done

if [ "${CREATEHTML}" == "createhtml" ]; then

   function join_by { local IFS="$1"; shift; echo "$*"; };
   JOINED_DATAFILES=`join_by , "${DATAFILES[@]}"`
   ${SCRIPTPATH}/generateViewerFileForStaticData.sh $EXPORTDIR "${JOINED_DATAFILES}" ${PLAYLISTFILE}
fi

echo "done - file export: playlist='${PLAYLISTNAMEFILTER}' to '${EXPORTDIR}' fileBase='${PLAYLISTFILE}'"
