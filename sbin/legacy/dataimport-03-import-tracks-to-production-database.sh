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
    dofail "USAGE: dataimport-03-import-tracks-to-production-database.sh importKey\nFATAL: requires 'importKey' as parameters 'import-XXXX'" 1
    exit 1
fi
IMPORTKEY=$1
${SCRIPTPATH}/setImportDirectory.sh $IMPORTKEY

echo "OPEN: Do you want to import tracks from import-database to production-database?"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) break;;
        No ) exit;;
    esac
done

echo "start - import track to production-database"

echo "now: configure linux vars: run configure-environment.bash"
source ${SCRIPTPATH}/configure-environment.bash

echo "now: initialize production-database (mysql)"
cd ${MYTB}
node_modules/.bin/db-migrate up\
           --migrations-dir migrations/mytbdb\
           --config ${CONFIG_BASEDIR}db-migrate-database.json\
           --env mytbdb_mysql
cd $CWD

echo "YOUR TODO: start facetcache for production-database in separate shell' cd ${MYTB} && npm run backend-start-server-managed-facetcache-dev && cd $CWD'"
echo "OPEN: Did you start the facetcache?"
select yn in "Yes"; do
    case $yn in
        Yes ) break;;
    esac
done

echo "now: export import-database"
if [[ ! -f "${MYTB_IMPORT_MEDIADIR}import/mytbdb_import-dump.json" && ! -f "${MYTB_IMPORT_MEDIADIR}import/DONE-mytbdb_import-dump.json" ]]; then
  echo "now: create image-export-file"
  cd ${MYTB}
  node dist/backend/serverAdmin.js\
           --debug\
           --command exportTourDoc\
           --action exportDocs\
           --adminclibackend ${CONFIG_BASEDIR}adminCli.import.json\
           --backend ${CONFIG_BASEDIR}backend.import.json\
           --file ${MYTB_IMPORT_MEDIADIR}import/mytbdb_import-dump.json
  cd $CWD
else
  if [ -f "${MYTB_IMPORT_MEDIADIR}import/mytbdb_import-dump.json" ]; then
      echo "WARNING: image-export-file already exists '${MYTB_IMPORT_MEDIADIR}import/mytbdb_import-dump.json'?"
  fi
  if [ -f "${MYTB_IMPORT_MEDIADIR}import/DONE-mytbdb_import-dump.json" ]; then
      echo "WARNING: imported image-export-file already exists '${MYTB_IMPORT_MEDIADIR}import/DONE-mytbdb_import-dump.json'?"
  fi
  ls -l ${MYTB_IMPORT_MEDIADIR}import/*.json
  echo "SKIP: export import-database"
  echo "OPEN: is this ok? If not type 'N' to exit and check the import-folder '${MYTB_IMPORT_MEDIADIR}import/'?"
  select yn in "Yes" "No"; do
      case $yn in
          Yes ) break;;
          No ) exit;;
      esac
  done
fi

echo "OPEN: is the file '${MYTB_IMPORT_MEDIADIR}import/mytbdb_import-dump.json' ok ? If not type 'N' to exit?"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) break;;
        No ) exit;;
    esac
done

echo "now: import into production-database"
cd ${MYTB}
node dist/backend/serverAdmin.js\
           --debug\
           --renameFileAfterSuccess true\
           --command loadTourDoc\
           --action loadDocs\
           --adminclibackend ${CONFIG_BASEDIR}adminCli.dev.json\
           --backend ${CONFIG_BASEDIR}backend.dev.json\
           --file ${MYTB_IMPORT_MEDIADIR}import/mytbdb_import-dump.json

# fallback if importdir is a symlink and file cant be renamed
if [ -f "${MYTB_IMPORT_MEDIADIR}import/mytbdb_import-dump.json" ]; then
  IMPORTDATE="$(date +"import-%Y%m%d-%H%M%S-%s")"
  mv ${MYTB_IMPORT_MEDIADIR}import/mytbdb_import-dump.json ${MYTB_IMPORT_MEDIADIR}import/DONE-mytbdb_import-dump-${IMPORTDATE}.json
fi
cd $CWD

echo "YOUR TODO: update appIds after check"
echo "   mysql"
echo "    source installer/db/mysql/mytbdb/update-appis.sql"
echo "YOUR TODO: copy or move images/video-folder from MYTB_IMPORT_MEDIADIR to MYTB_PROD_MEDIADIR"
echo "OPEN: Did you run your todos? Can we proceed the next steps?"
select yn in "Yes"; do
    case $yn in
        Yes ) break;;
    esac
done

echo "done - import track to production-database"
