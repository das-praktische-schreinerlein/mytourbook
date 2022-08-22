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
    dofail "USAGE: prepare-media-for-import.sh IMPORTKEY\nFATAL: requires 'IMPORTKEY' as parameters 'import-XXXX'" 1
    exit 1
fi
IMPORTKEY=$1

echo "start - prepare media for import: ${IMPORTKEY}"

source ${SCRIPTPATH}/configure-environment.bash

source ${SCRIPTPATH}/configure-import-environment.bash ${IMPORTKEY}

echo ""
echo ""
echo "##########################"
echo "YOUR TODO: autorotate images in import-folder"
echo "##########################"
echo "OPEN: Did you run this command in a windows-shell '${W_MYTBTOOLS}autorotateImagesInFolder.bat ${W_IMPORT_BASEDIR_SRC}'?"
select yn in "Yes"; do
    case $yn in
        Yes ) break;;
    esac
done

echo ""
echo ""
echo "##########################"
echo "OPTIONAL YOUR TODO: fix exif-date run this command in a windows-shell 'F:\\ProgrammePortable\\exiftool\\exiftool -ext jpg -overwrite_original_in_place -preserve -DateTimeOriginal-=\"0:0:0 7:40:0\" ${W_IMPORT_BASEDIR_SRC}\CIMG6228.JPG'"
echo "##########################"
echo "OPEN: Can we proceed the next steps ?"
select yn in "Yes"; do
    case $yn in
        Yes ) break;;
    esac
done

echo "now: convert videos: avi/mov... to mp4"
cd ${MYTB}
node dist/backend/serverAdmin.js --adminclibackend ${CONFIG_BASEDIR}adminCli.import.json --backend ${CONFIG_BASEDIR}backend.import.json --command mediaManager --action convertVideosFromMediaDirToMP4 --importDir ${IMPORT_BASEDIR_SRC}/ --outputDir ${IMPORT_BASEDIR_SRC}/ --debug true
cd $CWD

echo ""
echo ""
echo "##########################"
echo "now: rotate mp4-videos"
echo "OPTIONAL YOUR TODO: rotate mp4-videos run this command in a shell 'cd ${MYTB} && node dist/backend/serverAdmin.js --adminclibackend ${CONFIG_BASEDIR}adminCli.import.json --backend ${CONFIG_BASEDIR}backend.import.json --command mediaManager --action rotateVideo  --rotate 270 --debug true --srcFile ${IMPORT_BASEDIR_SRC}/CIMG6228.MOV.MP4 && cd $CWD'"
echo "##########################"
echo "OPEN: Can we proceed the next steps ?"
select yn in "Yes"; do
    case $yn in
        Yes ) break;;
    esac
done

echo ""
echo ""
echo "##########################"
echo "now: this will be imported in next steps"
echo "##########################"
ls -l ${IMPORT_BASEDIR_SRC}

echo "done - prepare media for import: ${IMPORTDIR} to '${IMPORTKEY_BASEDIR}'"
