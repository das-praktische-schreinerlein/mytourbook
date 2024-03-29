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
    dofail "USAGE: prepare-environment.sh IMPORTKEY\nFATAL: requires 'IMPORTKEY' as parameters 'import-XXXX'" 1
    exit 1
fi
IMPORTKEY=$1

echo "start - prepare environment: '${IMPORTKEY}'"

source ${SCRIPTPATH}/configure-environment.bash

source ${SCRIPTPATH}/configure-import-environment.bash ${IMPORTKEY}

echo "now: check and prepare directories on environment '${IMPORTKEY_BASEDIR}'"
[ -d "$IMPORTKEY_BASEDIR" ] || mkdir -p "$IMPORTKEY_BASEDIR"
[ -d "$IMPORT_BASEDIR_SRC" ] || mkdir -p "$IMPORT_BASEDIR_SRC"
[ -d "$IMPORT_BASEDIR_IMAGES_GROUPED" ] || mkdir -p "$IMPORT_BASEDIR_IMAGES_GROUPED"
[ -d "$IMPORT_BASEDIR_IMAGES_READY" ] || mkdir -p "$IMPORT_BASEDIR_IMAGES_READY"
[ -d "$IMPORT_BASEDIR_VIDEOS_READY" ] || mkdir -p "$IMPORT_BASEDIR_VIDEOS_READY"
[ -d "$IMPORT_BASEDIR_DONE" ] || mkdir -p "$IMPORT_BASEDIR_DONE"

echo "now: create image/video-dirs"
[ -d "$IMPORTKEY_BASEDIR/pics_full" ] || mkdir -p "$IMPORTKEY_BASEDIR/pics_full"
[ -d "$IMPORTKEY_BASEDIR/pics_x600" ] || mkdir -p "$IMPORTKEY_BASEDIR/pics_x600"
[ -d "$IMPORTKEY_BASEDIR/pics_x100" ] || mkdir -p "$IMPORTKEY_BASEDIR/pics_x100"

[ -d "$IMPORTKEY_BASEDIR/video_full" ] || mkdir -p "$IMPORTKEY_BASEDIR/video_full"
[ -d "$IMPORTKEY_BASEDIR/video_screenshot" ] || mkdir -p "$IMPORTKEY_BASEDIR/video_screenshot"
[ -d "$IMPORTKEY_BASEDIR/video_thumbnail" ] || mkdir -p "$IMPORTKEY_BASEDIR/video_thumbnail"
[ -d "$IMPORTKEY_BASEDIR/video_x600" ] || mkdir -p "$IMPORTKEY_BASEDIR/video_x600"

echo "now: create image/video-sym-links"
cd $IMPORTKEY_BASEDIR/
${MYTB}/node_modules/.bin/symlink-dir pics_full link_pics_x600
${MYTB}/node_modules/.bin/symlink-dir pics_full link_pics_x100
${MYTB}/node_modules/.bin/symlink-dir video_full link_video_x600
cd $CWD

echo "now: set workingdir to '${IMPORTKEY_BASEDIR}'"
${SCRIPTPATH}/setImportDirectory.sh $IMPORTKEY

echo "now: prepare app-environment (database-migrations...)"
cd ${MYTB}
node dist/backend/serverAdmin.js\
     --preparedCommand prepareAppEnv\
     --adminclibackend ${CONFIG_BASEDIR}adminCli.import.json\
     --backend ${CONFIG_BASEDIR}backend.import.json
cd $CWD

echo "done - prepare environment: '${IMPORTKEY_BASEDIR}'"
