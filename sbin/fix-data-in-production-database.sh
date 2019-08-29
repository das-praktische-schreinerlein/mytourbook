#!/bin/bash
# exit on error
set -e
CWD=$(pwd)

echo "start - fix data in production-database"

echo "now: configure linux vars: run sbin/configure-environment.bash"
source configure-environment.bash

echo "YOUR TODO: start backend with production-profile in separate shell (stop backend with import-profile before) 'cd ${MYTB} && npm run backend-serve-dev && cd $CWD'"
echo "YOUR TODO: start frontend with production-profile in separate shell (if not already startet) 'cd ${MYTB} && npm run frontendserver-serve-dev-de && cd $CWD'"
echo "YOUR TODO: manage import-data on http://localhost:4001/mytbdev/de/"
echo "OPEN: Did you start backend+frontend and managed the data?"
select yn in "Yes"; do
    case $yn in
        Yes ) break;;
    esac
done


echo "YOUR TODO: [SQL mediadb mysql: set gesperrt=0 if null](overrides/installer/db/mysql/mediadb/fix-track_image-blocked-default.sql)"
echo "YOUR TODO: [SQL mediadb mysql: set route to OFFEN](overrides/installer/db/mysql/mediadb/fix-tracks-without-route.sql)"
echo "YOUR TODO: [SQL mediadb mysql: fix trackdates from image in mysql-database](overrides/installer/db/mysql/mediadb/fix-trackdates-by-imagedates.sql)"
echo "YOUR TODO: [SQL mediadb mysql: fix gps-timecorrector for imported tracks!!!!!!](overrides/installer/db/mysql/mediadb/fix-gpx-timecorrector.sql)"
echo "YOUR TODO: generate gpx-track-files d:/webs/www.michas-ausflugstipps.de/libexec/gentracks.bat"
echo "YOUR TODO: [SQL mediadb mysql: fix trackdates from gps](overrides/installer/db/mysql/mediadb/fix-trackdates-by-gpstrackpoints.sql)"
echo "YOUR TODO: [SQL mediadb mysql: extract imagegps](overrides/installer/db/mysql/mediadb/update-imagecoor-by-gpstrackpoints.sql)"
echo "YOUR TODO: index images: F:/projekte/mediadb2/libexec/doindeximages.bat"

echo "YOUR TODO: run picasa on image-folder"
echo "YOUR TODO: start [mycms-objectdetector](https://github.com/das-praktische-schreinerlein/mycms-objectdetector)"
echo "OPEN: Can we proceed the next steps?"
select yn in "Yes"; do
    case $yn in
        Yes ) break;;
    esac
done

echo "YOUR TODO: start object-queue-receiver in a separate shell 'cd ${MYTB} && node dist/backend/serverAdmin.js --command objectDetectionManager --action receiveQueueResponses --debug 1 && cd $CWD"
echo "OPEN: Can we proceed the next steps?"
select yn in "Yes"; do
    case $yn in
        Yes ) break;;
    esac
done

echo "now: send to queue (2 runs -> to get picasa-files blocked till picasa finished)"
cd ${MYTB}
node dist/backend/serverAdmin.js --command objectDetectionManager --action sendQueueRequests --detector picasafile --maxPerRun 2000 --debug 1
node dist/backend/serverAdmin.js --command objectDetectionManager --action sendQueueRequests --detector tfjs_cocossd_mobilenet_v1,tfjs_cocossd_mobilenet_v2,tfjs_cocossd_lite_mobilenet_v2,tfjs_mobilenet_v1,faceapi --maxPerRun 2000 --debug 1
cd $CWD

echo "done - fix data in production-database"
