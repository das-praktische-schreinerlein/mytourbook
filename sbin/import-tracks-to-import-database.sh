#!/bin/bash
# exit on error
set -e

CWD=$(pwd)

echo "OPEN: Do you want to import track to import-database?"
select yn in "Yes"; do
    case $yn in
        Yes ) break;;
        No ) exit;;
    esac
done
echo "start - import track to import-database"

echo "now: configure linux vars: run configure-environment.bash"
source configure-environment.bash

echo "now: initialize import-database (sqlite)"
cd ${MYTB}
node_modules/.bin/db-migrate up --migrations-dir migrations/mytbdb --config config/db-migrate-database.json --env mytbdb_import_sqlite3
cd $CWD

echo "YOUR TODO: start facetcache for import-database in separate shell: 'cd ${MYTB} && npm run backend-start-server-managed-facetcache-dev-import && cd $CWD'"
echo "OPEN: Did you start the facetcache?"
select yn in "Yes"; do
    case $yn in
        Yes ) break;;
    esac
done

echo "now: load import-files"
cd ${MYTB}
node dist/backend/serverAdmin.js --debug --command loadTourDoc  -c config/backend.import.json -f ${MYTB_IMPORT_MEDIADIR}import/mytbdb_import-import-images.json
node dist/backend/serverAdmin.js --debug --command loadTourDoc  -c config/backend.import.json -f ${MYTB_IMPORT_MEDIADIR}import/mytbdb_import-import-videos.json
cd $CWD

echo "OPTIONAL: read image-dates"
echo "OPEN: Do you want to read the image-dates?"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) cd ${MYTB} && node dist/backend/serverAdmin.js --command imageManager --action readImageDates -c config/backend.import.json; break;;
        No) break;;
    esac
done

echo "now: create scaled image-copies"
cd ${MYTB}
node dist/backend/serverAdmin.js --command imageManager --action scaleImages -c config/backend.import.json
cd $CWD

echo "now: create scaled video-copies"
cd ${MYTB}
node dist/backend/serverAdmin.js --command mediaManager --action generateVideoScreenshotFromMediaDir --importDir ${MYTB_IMPORT_MEDIADIR}import/video_full/ --outputDir ${MYTB_IMPORT_MEDIADIR}import//video_screenshot/ --debug true
node dist/backend/serverAdmin.js --command mediaManager --action generateVideoPreviewFromMediaDir --importDir ${MYTB_IMPORT_MEDIADIR}import/video_full/ --outputDir ${MYTB_IMPORT_MEDIADIR}import/video_thumbnail/ --debug true
node dist/backend/serverAdmin.js --command mediaManager --action scaleVideosFromMediaDirToMP4 --importDir ${MYTB_IMPORT_MEDIADIR}import/video_full/ --outputDir ${MYTB_IMPORT_MEDIADIR}import/video_x600/ --debug true
cd $CWD

echo "OPTIONAL YOUR TODO: fix image-date if needed (via gui or cli and run script manually overrides/installer/db/sqlite/mediadb/fix-imagedates.sql)"
echo "OPEN: Can we proceed the next steps?"
select yn in "Yes"; do
    case $yn in
        Yes ) break;;
    esac
done

echo "YOUR TODO: start backend with import-profile in separate shell 'cd ${MYTB} && npm run backend-serve-dev-import && cd $CWD'"
echo "YOUR TODO: start frontend with import-profile in separate shell 'cd ${MYTB} && npm run frontendserver-serve-dev-de && cd $CWD'"
echo "YOUR TODO: manage import-data on http://localhost:4001/mytbdev/de/"

echo "done - import track to import-database"
