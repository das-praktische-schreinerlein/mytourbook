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
    dofail "USAGE: dataexport-playlist.sh CONFIGPROFILE EXPORTDIR [PLAYLISTNAMEFILTER PLAYLISTFILE RESOLUTIONPROFILE DIPROFILE FILEPROFILE CONFIGPROFILE RATEMINFILTER BLOCKEDFILTER FULLTEXT CREATEHTML TYPES] \nFATAL: requires 2 parameters " 1
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

${SCRIPTPATH}/mediaexport.sh "$CONFIGPROFILE" "$EXPORTDIR" "$PLAYLISTNAMEFILTER" "$PLAYLISTFILE" "$RESOLUTIONPROFILE" "$DIPROFILE" "$FILEPROFILE" "$RATEMINFILTER" "$SHOWNONBLOCKEDONLY" "$FULLTEXRFILTER" "$CREATEHTML" "$TYPES"
