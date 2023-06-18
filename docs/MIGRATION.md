# Migration-Hints for MyTourBook

## Version 7 -> 8.0.0

### migrate page-documents

#### migrate legacy docs-files to new format
- migrate legacy docs-files to new format
```
CONFIG_BASEDIR=./config/
CONFIGPROFILE=import
PROFILES=profile_dev,profile_import,profile_beta,profile_prod

node dist/backend/serverAdmin.js\
      --command convertPDoc\
      --action migrateLegacyPDocFile\
      --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
      --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
      --renameFileIfExists true\
      --srcFile config/pdocs-de.json \
      --langkeys lang_de \
      --profiles ${PROFILES} \
      --file config/pdocs-de.json\
      --debug 1
node dist/backend/serverAdmin.js\
      --command convertPDoc\
      --action migrateLegacyPDocFile\
      --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
      --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
      --renameFileIfExists true\
      --srcFile config/pdocs-en.json \
      --langkeys lang_en \
      --profiles ${PROFILES} \
      --file config/pdocs-en.json\
      --debug 1

PROFILES=profile_static
node dist/backend/serverAdmin.js\
      --command convertPDoc\
      --action migrateLegacyPDocFile\
      --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
      --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
      --renameFileIfExists true\
      --srcFile src/frontend/assets/pdocs.json \
      --langkeys lang_de,lang_en \
      --profiles ${PROFILES} \
      --file src/frontend/assets/pdocs.json \
      --debug 1

PROFILES=profile_viewer
node dist/backend/serverAdmin.js\
      --command convertPDoc\
      --action migrateLegacyPDocJsonPFile\
      --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
      --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
      --renameFileIfExists true\
      --srcFile src/frontend/assets/staticdata/static.mytbpdocs.js \
      --langkeys lang_de,lang_en \
      --profiles ${PROFILES} \
      --file src/frontend/assets/staticdata/static.mytbpdocs.js \
      --debug 1
```

#### if you will use: use database based pdoc-managameent
- migrate files to import-formt and import into database
```
CONFIG_BASEDIR=./config/
CONFIGPROFILE=import
PDOCS_BASEDIR=./config/
LANG=de
PROFILE=dev
node dist/backend/serverAdmin.js\
      --command convertPDoc\
      --action migratePDocFileToMapperFile\
      --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
      --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
      --renameFileIfExists true\
      --srcFile config/pdocs-${LANG}.json \
      --file ${PDOCS_BASEDIR}pdocs-${PROFILE}-${LANG}-import.json\
      --debug 1
node dist/backend/serverAdmin.js\
      --command loadPDoc\
      --action loadDocs\
      --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
      --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
      --renameFileAfterSuccess true\
      --file ${PDOCS_BASEDIR}pdocs-${PROFILE}-${LANG}-import.json \
      --debug 1

PDOCS_BASEDIR=./config/
LANG=de
PROFILE=static
node dist/backend/serverAdmin.js\
      --command convertPDoc\
      --action migratePDocFileToMapperFile\
      --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
      --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
      --renameFileIfExists true\
      --srcFile src/frontend/assets/pdocs.json \
      --file ${PDOCS_BASEDIR}pdocs-${PROFILE}-${LANG}-import.json\
      --debug 1
node dist/backend/serverAdmin.js\
      --command loadPDoc\
      --action loadDocs\
      --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
      --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
      --renameFileAfterSuccess true\
      --file ${PDOCS_BASEDIR}pdocs-${PROFILE}-${LANG}-import.json \
      --debug 1
```
- export files from database
```
CONFIGPROFILE=import
EXPORTDIR=./config/
./sbin/exportPDocs.sh ${CONFIGPROFILE} ${EXPORTDIR} pdocs-de lang_de profile_dev
./sbin/exportPDocs.sh ${CONFIGPROFILE} ${EXPORTDIR} pdocs-en lang_en profile_dev

EXPORTDIR=./src/frontend/assets/
./sbin/exportPDocs.sh ${CONFIGPROFILE} ${EXPORTDIR} pdocs lang_de profile_static
```
