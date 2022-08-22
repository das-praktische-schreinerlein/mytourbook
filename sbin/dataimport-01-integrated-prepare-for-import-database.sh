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
    dofail "USAGE: dataimport-01-prepare-tracks-for-import-database.sh IMPORTKEY\nFATAL: requires 'IMPORTKEY' as parameters 'import-XXXX'" 1
    exit 1
fi
IMPORTKEY=$1

echo "start - prepare track import: ${IMPORTKEY}"

echo "now: configure linux vars: run sbin/configure-environment.sh"
source ${SCRIPTPATH}/configure-environment.bash

echo ""
echo ""
echo "##########################"
echo "OPEN: Do you want to start track import for '${MYTB_IMPORT_MEDIADIR}/${IMPORTKEY}'?"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) break;;
        No ) exit;;
    esac
done

echo "now: configure import linux vars: run sbin/configure-import-environment.sh"
source ${SCRIPTPATH}/configure-import-environment.bash ${IMPORTKEY}

echo "now: set workingdir to '${IMPORTKEY_BASEDIR}'"
${SCRIPTPATH}/setImportDirectory.sh $IMPORTKEY

echo "now: prepare environment for '${MYTB_IMPORT_MEDIADIR}/${IMPORTKEY}'"
source ${SCRIPTPATH}/prepare-environment.sh ${IMPORTKEY}

echo ""
echo ""
echo "##########################"
echo "YOUR TODO: copy your images/videos to folder '${IMPORT_BASEDIR_SRC}'?"
echo "##########################"
echo "OPEN: Do you want to import files from '${IMPORT_BASEDIR_SRC}'?"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) break;;
        No ) exit;;
    esac
done

${SCRIPTPATH}/prepare-media-for-import.sh ${IMPORTKEY}

# do copy and imports
echo "now: copy media to import-folder and group in by date into subfolder '${IMPORT_BASEDIR_SRC} ${IMPORT_BASEDIR_IMAGES_GROUPED}/'"
${MYTBTOOLS}copyFilesToDateFolder.sh ${IMPORT_BASEDIR_SRC} ${IMPORT_BASEDIR_IMAGES_GROUPED}

echo ""
echo ""
echo "##########################"
echo "YOUR TODO: manually rename media-folder by tour and add location in foldername '${IMPORT_BASEDIR_IMAGES_GROUPED}'"
echo "YOUR TODO: move '${IMPORT_BASEDIR_IMAGES_GROUPED}' -> to '${IMPORT_BASEDIR_IMAGES_READY}'"
echo "##########################"
echo "OPEN: Did you managed the import-folders in '${IMPORT_BASEDIR_IMAGES_READY}'?"
select yn in "Yes"; do
    case $yn in
        Yes ) break;;
    esac
done

echo "now: move videos to videofolder '${IMPORT_BASEDIR_IMAGES_READY} ${IMPORT_BASEDIR_VIDEOS_READY}'"
${MYTBTOOLS}moveVideosToVideoFolder.sh ${IMPORT_BASEDIR_IMAGES_READY} ${IMPORT_BASEDIR_VIDEOS_READY}

echo ""
echo ""
echo "##########################"
echo "now: this will be imported in next steps"
echo "##########################"
ls -l ${IMPORT_BASEDIR_IMAGES_READY}
ls -l ${IMPORT_BASEDIR_VIDEOS_READY}

echo ""
echo ""
echo "##########################"
echo "OPEN: should we import this?"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) break;;
        No ) exit;;
    esac
done

IMPORTDIR="$(date +"import-%Y%m%d")"
if [ -d "${IMPORT_BASEDIR_IMAGES_DONE}/SRC_${IMPORTDIR}" ] || [ -d "${IMPORT_BASEDIR_IMAGES_DONE}/READY_${IMPORTDIR}" ]; then
   IMPORTDIR="$(date +"import-%Y%m%d-%H%M%S-%s")"
fi

echo "now: copy images and prefix path '${IMPORT_BASEDIR_IMAGES_READY} ${IMPORTKEY_BASEDIR}/pics_full ${IMPORTDIR}_'"
${MYTBTOOLS}copyDirsAndPrefixPath.sh  ${IMPORT_BASEDIR_IMAGES_READY} ${IMPORTKEY_BASEDIR}/pics_full ${IMPORTDIR}_

echo "now: move media from import-folder '${IMPORT_BASEDIR_SRC}' to archive- '${IMPORT_BASEDIR_IMAGES_DONE}/SOURCE_${IMPORTDIR}/'"
mkdir -p "${IMPORT_BASEDIR_SRC_DONE}/SOURCE_${IMPORTDIR}/"
touch ${IMPORT_BASEDIR_SRC}/DONE.flag
mv ${IMPORT_BASEDIR_SRC}/* ${IMPORT_BASEDIR_SRC_DONE}/SOURCE_${IMPORTDIR}/

echo "now: move image-import '${IMPORT_BASEDIR_IMAGES_READY}' to archive '${IMPORT_BASEDIR_IMAGES_DONE}/READY_${IMPORTDIR}'"
mkdir ${IMPORT_BASEDIR_IMAGES_DONE}/READY_${IMPORTDIR}
touch ${IMPORT_BASEDIR_IMAGES_READY}/DONE.flag
mv ${IMPORT_BASEDIR_IMAGES_READY}/* ${IMPORT_BASEDIR_IMAGES_DONE}/READY_${IMPORTDIR}/

echo "now: copy videos and prefix path '${IMPORT_BASEDIR_VIDEOS_READY} ${IMPORTKEY_BASEDIR}/video_full ${IMPORTDIR}_'"
${MYTBTOOLS}copyDirsAndPrefixPath.sh ${IMPORT_BASEDIR_VIDEOS_READY} ${IMPORTKEY_BASEDIR}/video_full ${IMPORTDIR}_

echo "now: move video-import '${IMPORT_BASEDIR_VIDEOS_READY}' to archive '${IMPORT_BASEDIR_VIDEOS_DONE}/READY_${IMPORTDIR}'"
mkdir ${IMPORT_BASEDIR_VIDEOS_DONE}/READY_${IMPORTDIR}
touch ${IMPORT_BASEDIR_VIDEOS_READY}/DONE.flag
mv ${IMPORT_BASEDIR_VIDEOS_READY}/* ${IMPORT_BASEDIR_VIDEOS_DONE}/READY_${IMPORTDIR}/

echo "now: generate import-files: '${IMPORTKEY_BASEDIR}/mytbdb_import-import-images.json' + '${IMPORTKEY_BASEDIR}/mytbdb_import-import-videos.json'"
cd ${MYTB}
node dist/backend/serverAdmin.js --adminclibackend ${CONFIG_BASEDIR}adminCli.import.json --backend ${CONFIG_BASEDIR}backend.import.json  --command mediaManager --action generateTourDocsFromMediaDir --importDir ${IMPORTKEY_BASEDIR}/pics_full/ --debug true --renameFileIfExists true --outputFile ${IMPORTKEY_BASEDIR}/mytbdb_import-import-images.json > "${IMPORTKEY_BASEDIR}/mytbdb_import-import-images.log"
node dist/backend/serverAdmin.js --adminclibackend ${CONFIG_BASEDIR}adminCli.import.json --backend ${CONFIG_BASEDIR}backend.import.json  --command mediaManager --action generateTourDocsFromMediaDir --importDir ${IMPORTKEY_BASEDIR}/video_full/ --debug true --renameFileIfExists true --outputFile ${IMPORTKEY_BASEDIR}/mytbdb_import-import-videos.json > "${IMPORTKEY_BASEDIR}/mytbdb_import-import-videos.log"

echo ""
echo ""
echo "##########################"
echo "OPTIONAL YOUR TODO: fix import-files (location-names...)"
echo "##########################"
echo "OPEN: Did fix this files in editor '${IMPORTKEY_BASEDIR}/mytbdb_import-import-images.json ${IMPORTKEY_BASEDIR}/mytbdb_import-import-videos.json'?"
select yn in "Yes"; do
    case $yn in
        Yes ) break;;
    esac
done

echo "done - prepare track import: ${IMPORTDIR} to '${IMPORTKEY_BASEDIR}'"
