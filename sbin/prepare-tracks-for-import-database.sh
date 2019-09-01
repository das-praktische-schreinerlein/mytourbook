#!/bin/bash
# exit on error
set -e

# check parameters
if [ "$#" -ne 1 ]; then
    echo "prepare-track-import importKey"
    echo "FATAL: requires 'importKey' as parameters 'import-XXXX'"
    exit 1
fi
IMPORTKEY=$1
CWD=$(pwd)

echo "start - prepare track import: ${IMPORTKEY}"

echo "now: configure linux vars: run sbin/configure-environment.sh"
source ./configure-environment.bash

echo "now: prepare image-import-folder"
if [ ! -d "${DIGIFOTOS_BASEDIR}OFFEN/${IMPORTKEY}" ]; then
  mkdir -p ${DIGIFOTOS_BASEDIR}OFFEN/${IMPORTKEY}
fi

echo "OPEN: Do you want to start track import'${DIGIFOTOS_BASEDIR}OFFEN/${IMPORTKEY}'?"
select yn in "Yes"; do
    case $yn in
        Yes ) break;;
        No ) exit;;
    esac
done

echo "now: copy images to import-folder and group in subfolder by date"
${MYTBTOOLS}copyFilesToDateFolder.sh ${DIGIFOTOS_BASEDIR}/OFFEN/${IMPORTKEY} ${DIGIFOTOS_BASEDIR}/import-PRESORTED/${IMPORTKEY}

echo "now: create import folder"
if [ ! -d "${DIGIFOTOS_BASEDIR}import-READY/${IMPORTKEY}" ]; then
  mkdir -p ${DIGIFOTOS_BASEDIR}import-READY/${IMPORTKEY}
fi
echo "YOUR TODO: manually rename image-folder by tour and add location to foldername '${DIGIFOTOS_BASEDIR}import-READY/${IMPORTKEY}'"
echo "OPEN: Did you managed the import-folders in '${DIGIFOTOS_BASEDIR}import-READY/${IMPORTKEY}'?"
select yn in "Yes"; do
    case $yn in
        Yes ) break;;
    esac
done

ls -l ${DIGIFOTOS_BASEDIR}import-READY/${IMPORTKEY}
echo "OPEN: should we import this?"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) break;;
        No ) exit;;
    esac
done

echo "YOUR TODO: autorotate images in import-folder"
echo "OPEN: Did you run this command in a windows-shell '${W_MYTBTOOLS}autorotateImagesInFolder.bat ${W_DIGIFOTOS_BASEDIR}import-READY\\${IMPORTKEY}'?"
select yn in "Yes"; do
    case $yn in
        Yes ) break;;
    esac
done

echo "now: move videos to videofolder"
${MYTBTOOLS}copyVideosToVideoFolder.sh ${DIGIFOTOS_BASEDIR}import-READY/${IMPORTKEY} ${VIDEOS_BASEDIR}import-READY/${IMPORTKEY}

echo "OPTIONAL YOUR TODO: fix exif-date run this command in a windows-shell 'D:\\ProgrammePortable\\exiftool\\exiftool -ext jpg -overwrite_original_in_place -preserve -DateTimeOriginal-=\"0:0:0 7:40:0\" ${W_DIGIFOTOS_BASEDIR}import-READY\\${IMPORTKEY}_Blablum\\CIMG6228.JPG'"
echo "OPEN: Can we poceed the next steps ?"
select yn in "Yes"; do
    case $yn in
        Yes ) break;;
    esac
done

echo "now: copy images and prefix path"
${MYTBTOOLS}copyDirsAndPrefixPath.sh  ${DIGIFOTOS_BASEDIR}import-READY/${IMPORTKEY} ${MYTB_IMPORT_MEDIADIR}${IMPORTKEY}/pics_full ${IMPORTKEY}
${MYTBTOOLS}copyDirsAndPrefixPath.sh  ${VIDEOS_BASEDIR}import-READY/${IMPORTKEY} ${MYTB_IMPORT_MEDIADIR}${IMPORTKEY}/video_full ${IMPORTKEY}

echo "now: create symlink so that this folder is the current import-folder'link_${IMPORTKEY} ${IMPORTKEY}'"
cd $MYTB_IMPORT_MEDIADIR
${MYTB}/node_modules/.bin/symlink-dir ${IMPORTKEY} link_${IMPORTKEY}
mv link_${IMPORTKEY} import
cd $CWD

echo "now: convert videos: avi/mov... to mp4"
cd ${MYTB}
node dist/backend/serverAdmin.js --command mediaManager --action convertVideosFromMediaDirToMP4 --importDir ${MYTB_IMPORT_MEDIADIR}${IMPORTKEY}/video_full/ --outputDir ${MYTB_IMPORT_MEDIADIR}${IMPORTKEY}/video_full/ --debug true
cd $CWD

echo "now: rotate mp4-videos"
echo "OPTIONAL YOUR TODO: rotate mp4-videos run this command in a shell 'cd ${MYTB} && node dist/backend/serverAdmin.js --command mediaManager --action rotateVideo  --rotate 270 --debug true --srcFile ${MYTB_IMPORT_MEDIADIR}${IMPORTKEY}/video_full/${IMPORTKEY}_Blablum/CIMG6228.MOV.MP4 && cd $CWD'"
echo "OPEN: Can we poceed the next steps ?"
select yn in "Yes"; do
    case $yn in
        Yes ) break;;
    esac
done

echo "now: create image/video-sym-links"
cd ${MYTB_IMPORT_MEDIADIR}/${IMPORTKEY}
${MYTB}/node_modules/.bin/symlink-dir pics_full link_pics_x600
${MYTB}/node_modules/.bin/symlink-dir pics_full link_pics_x100
mkdir pics_x600
mkdir pics_x100
${MYTB}/node_modules/.bin/symlink-dir video_full link_video_x600
mkdir video_screenshot
mkdir video_thumbnail
mkdir video_x600
cd $CWD

echo "now: generate import-files"
cd ${MYTB}
node dist/backend/serverAdmin.js -c config/backend.import.json  --command mediaManager --action generateTourDocsFromMediaDir --importDir ${MYTB_IMPORT_MEDIADIR}import/pics_full/ --debug true > ${MYTB_IMPORT_MEDIADIR}import/mytbdb_import-import-images.json
node dist/backend/serverAdmin.js -c config/backend.import.json  --command mediaManager --action generateTourDocsFromMediaDir --importDir ${MYTB_IMPORT_MEDIADIR}import/video_full/ --debug true > ${MYTB_IMPORT_MEDIADIR}import/mytbdb_import-import-videos.json

echo "OPTIONAL YOUR TODO: fix import-files (location-names...)"
echo "OPEN: Did fix this files in editor '${MYTB_IMPORT_MEDIADIR}import/mytbdb_import-import-images.json ${MYTB_IMPORT_MEDIADIR}import/mytbdb_import-import-videos.json'?"
select yn in "Yes"; do
    case $yn in
        Yes ) break;;
    esac
done

echo "done - prepare track import: ${import-XXXX}"

