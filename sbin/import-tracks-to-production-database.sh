#!/bin/bash
# exit on error
set -e

CWD=$(pwd)

echo "OPEN: Do you want to import tracks from import-database to production-database?"
select yn in "Yes"; do
    case $yn in
        Yes ) break;;
        No ) exit;;
    esac
done

echo "start - import track to production-database"

echo "now: configure linux vars: run configure-environment.bash"
source configure-environment.bash

echo "now: initialize production-database (mysql)"
cd ${MYTB}
node_modules/.bin/db-migrate up --migrations-dir migrations/mytbdb --config config/db-migrate-database.json --env mytbdb_mysql
cd $CWD

echo "YOUR TODO: start facetcache for production-database in separate shell' cd ${MYTB} && npm run backend-start-server-managed-facetcache-dev && cd $CWD'"
echo "OPEN: Did you start the facetcache?"
select yn in "Yes"; do
    case $yn in
        Yes ) break;;
    esac
done

echo "now: export import-database"
cd ${MYTB}
node dist/backend/serverAdmin.js --debug --command exportTourDoc  -c config/backend.import.json -f ${MYTB_IMPORT_MEDIADIR}import/mytbdb_import-dump.json
cd $CWD

echo "now: import into production-database"
cd ${MYTB}
node dist/backend/serverAdmin.js --debug --command loadTourDoc  -c config/backend.json -f ${MYTB_IMPORT_MEDIADIR}import/mytbdb_import-dump.json
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
