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
    dofail "USAGE: dataimport-02-import-tracks-to-import-database.sh importKey\nFATAL: requires 'importKey' as parameters 'import-XXXX'" 1
    exit 1
fi
IMPORTKEY=$1
${SCRIPTPATH}/setImportDirectory.sh $IMPORTKEY

echo "OPEN: Do you want to import track to import-database?"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) break;;
        No ) exit;;
    esac
done
echo "start - import track to import-database"

echo "now: configure linux vars: run configure-environment.bash"
source ${SCRIPTPATH}/configure-environment.bash

echo "now: prepare app-environment (database-migrations...)"
cd ${MYTB}
node dist/backend/serverAdmin.js --preparedCommand prepareAppEnv --adminclibackend ${CONFIG_BASEDIR}adminCli.import.json --backend ${CONFIG_BASEDIR}backend.import.json
cd $CWD

echo "YOUR TODO: start facetcache for import-database in separate shell: 'cd ${MYTB} && npm run backend-start-server-managed-facetcache-import && cd $CWD'"
echo "OPEN: Did you start the facetcache?"
select yn in "Yes"; do
    case $yn in
        Yes ) break;;
    esac
done

echo "now: load import-files"
if [ -f "${MYTB_IMPORT_MEDIADIR}import/mytbdb_import-import-images.json" ]; then
  echo "now: load image-import-file"
  cd ${MYTB}
  node dist/backend/serverAdmin.js --debug --command loadTourDoc --action loadDocs --adminclibackend ${CONFIG_BASEDIR}adminCli.import.json --backend ${CONFIG_BASEDIR}backend.import.json --file ${MYTB_IMPORT_MEDIADIR}import/mytbdb_import-import-images.json
  mv  ${MYTB_IMPORT_MEDIADIR}import/mytbdb_import-import-images.json  ${MYTB_IMPORT_MEDIADIR}import/DONE-mytbdb_import-import-images.json
  cd $CWD
else
  echo "WARNING: image-import-file not exists '${MYTB_IMPORT_MEDIADIR}import/mytbdb_import-import-images.json'?"
  ls -l ${MYTB_IMPORT_MEDIADIR}import/*.json
  echo "SKIP: load image-import-file"
  echo "OPEN: is this ok? If not type 'N' to exit and check the import-folder '${MYTB_IMPORT_MEDIADIR}import/'?"
  select yn in "Yes" "No"; do
      case $yn in
          Yes ) break;;
          No ) exit;;
      esac
  done
fi

if [ -f "${MYTB_IMPORT_MEDIADIR}import/mytbdb_import-import-videos.json" ]; then
  echo "now: load video-import-file"
  cd ${MYTB}
  node dist/backend/serverAdmin.js --debug --command loadTourDoc --action loadDocs --adminclibackend ${CONFIG_BASEDIR}adminCli.import.json --backend ${CONFIG_BASEDIR}backend.import.json --file ${MYTB_IMPORT_MEDIADIR}import/mytbdb_import-import-videos.json
  mv  ${MYTB_IMPORT_MEDIADIR}import/mytbdb_import-import-videos.json  ${MYTB_IMPORT_MEDIADIR}import/DONE-mytbdb_import-import-videos.json
  cd $CWD
else
  echo "WARNING: video-import-file not exists '${MYTB_IMPORT_MEDIADIR}import/mytbdb_import-import-videos.json'?"
  ls -l ${MYTB_IMPORT_MEDIADIR}import/*.json
  echo "SKIP: load video-import-file"
  echo "OPEN: is this ok? If not type 'N' to exit and check the import-folder '${MYTB_IMPORT_MEDIADIR}import/'?"
  select yn in "Yes" "No"; do
      case $yn in
          Yes ) break;;
          No ) exit;;
      esac
  done
fi

echo "OPTIONAL: read image-dates"
echo "OPEN: Do you want to read the image-dates?"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) cd ${MYTB} && node dist/backend/serverAdmin.js --command mediaManager --action readImageDates --debug true --adminclibackend ${CONFIG_BASEDIR}adminCli.import.json  --backend ${CONFIG_BASEDIR}backend.import.json; break;;
        No) break;;
    esac
done

echo "OPTIONAL: read video-dates"
echo "OPEN: Do you want to read the video-dates?"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) cd ${MYTB} && node dist/backend/serverAdmin.js --command mediaManager --action readVideoDates --debug true --adminclibackend ${CONFIG_BASEDIR}adminCli.import.json  --backend ${CONFIG_BASEDIR}backend.import.json; break;;
        No) break;;
    esac
done

echo "now: create scaled image-copies"
cd ${MYTB}
node dist/backend/serverAdmin.js --command mediaManager --action scaleImages --debug true --adminclibackend ${CONFIG_BASEDIR}adminCli.import.json --backend ${CONFIG_BASEDIR}backend.import.json
cd $CWD

echo "now: create scaled video-copies"
cd ${MYTB}
node dist/backend/serverAdmin.js --command mediaManager --action scaleVideos --debug true --adminclibackend ${CONFIG_BASEDIR}adminCli.import.json --backend ${CONFIG_BASEDIR}backend.import.json
cd $CWD

echo "OPTIONAL YOUR TODO: fix image/track-date if needed (via gui or cli and run script manually)"
echo "   sqlitecli"
echo "    source installer/db/sqlite/mytbdb/fixture-fix-imagedates.sql"
echo "    source installer/db/sqlite/mytbdb/fixture-fix-trackdates-by-imagedates.sql"
echo "    source installer/db/sqlite/mytbdb/fixture-delete-tracks-unused.sql"
echo "OPEN: Did you run the sql-fixtures? Can we proceed the next steps?"
select yn in "Yes"; do
    case $yn in
        Yes ) break;;
    esac
done

echo "YOUR TODO: start backend with import-profile in separate shell 'cd ${MYTB} && npm run backend-serve-import && cd $CWD'"
echo "YOUR TODO: start frontend with import-profile in separate shell 'cd ${MYTB} && npm run frontendserver-serve-dev-de && cd $CWD'"
echo "YOUR TODO: manage import-data on http://localhost:4001/mytbdev/de/"

echo "done - import track to import-database"
