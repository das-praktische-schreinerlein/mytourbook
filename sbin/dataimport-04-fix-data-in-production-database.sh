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

echo "start - fix data in production-database"

echo "now: configure linux vars: run sbin/configure-environment.bash"
source ${SCRIPTPATH}/configure-environment.bash


echo "OPTIONAL: index images"
echo "OPEN: Do you want to index the images for similarity-search?"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) cd ${MYTB}/sbin && ./indexImages.sh; break;;
        No) break;;
    esac
done

echo "YOUR TODO: start backend with production-profile in separate shell (stop backend with import-profile before) 'cd ${MYTB} && npm run backend-serve-dev && cd $CWD'"
echo "YOUR TODO: start frontend with production-profile in separate shell (if not already startet) 'cd ${MYTB} && npm run frontendserver-serve-dev-de && cd $CWD'"
echo "YOUR TODO: manage import-data on http://localhost:4001/mytbdev/de/"
echo "OPEN: Did you start backend+frontend and managed the data?"
select yn in "Yes"; do
    case $yn in
        Yes ) break;;
    esac
done

echo "YOUR TODO: run fixtures on mysql"
echo "OPTIONAL YOUR TODO: fix image/track-date if needed (via gui or cli and run script manually)"
echo "   mysql"
echo "    source installer/db/mysql/mytbdb/fixture-fix-imagedates.sql"
echo "    source installer/db/mysql/mytbdb/fixture-fix-track_image-blocked-default.sql"
echo "    source installer/db/mysql/mytbdb/fixture-fix-tracks-without-route.sql"
echo "    source installer/db/mysql/mytbdb/fixture-fix-trackdates-by-imagedates.sql"
echo "    source installer/db/mysql/mytbdb/fixture-fix-gpx-timecorrector.sql)"
echo "YOUR TODO: generate gpx-track-files F:/webs/www.michas-ausflugstipps.de/libexec/gentracks.bat"
echo "OPTIONAL YOUR TODO: fix image/track-date if needed (via gui or cli and run script manually)"
echo "   mysql"
echo "    source installer/db/mysql/mytbdb/fixture-fix-trackdates-by-gpstrackpoints.sql"
echo "YOUR TODO: fix image/video-coordinates (via gui or cli and run script manually)"
echo "   mysql"
echo "    source installer/db/mysql/mytbdb/fixture-update-imagecoor-by-gpstrackpoints.sql"
echo "    source installer/db/mysql/mytbdb/fixture-update-videocoor-by-gpstrackpoints.sql"
echo "YOUR TODO: index images: F:/projekte/mediadb2/libexec/doindeximages.bat"
echo "YOUR TODO: run picasa on image-folder"
echo "YOUR TODO: start [mycms-objectdetector](https://github.com/das-praktische-schreinerlein/mycms-objectdetector)"
echo "OPEN: Did you run your steps? Can we proceed the next steps?"
select yn in "Yes"; do
    case $yn in
        Yes ) break;;
    esac
done

echo "YOUR TODO: start object-queue-receiver in a separate shell 'cd ${MYTB} && node dist/backend/serverAdmin.js -c ${CONFIG_BASEDIR}backend.json --command objectDetectionManager --action receiveQueueResponses --debug 1 && cd $CWD"
echo "OPEN: Can we proceed the next steps?"
select yn in "Yes"; do
    case $yn in
        Yes ) break;;
    esac
done

echo "now: send to queue (2 runs -> to get picasa-files blocked till picasa finished)"
cd ${MYTB}
node dist/backend/serverAdmin.js -c ${CONFIG_BASEDIR}backend.json --command objectDetectionManager --action sendQueueRequests --detector picasafile --maxPerRun 2000 --debug 1
node dist/backend/serverAdmin.js -c ${CONFIG_BASEDIR}backend.json --command objectDetectionManager --action sendQueueRequests --detector tfjs_cocossd_mobilenet_v1,tfjs_cocossd_mobilenet_v2,tfjs_cocossd_lite_mobilenet_v2,tfjs_mobilenet_v1,faceapi --maxPerRun 2000 --debug 1
cd $CWD

echo "done - fix data in production-database"
