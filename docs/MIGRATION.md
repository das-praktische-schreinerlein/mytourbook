# Migration-Hints for MyTourBook

## Version 7 -> 8.0.0

### migrate page-documents

#### migrate legacy docs-files to new format
- migrate legacy docs-files to new format
```
CONFIG_BASEDIR=./config/
CONFIGPROFILE=dev
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
      --action extractPDocViewerFile\
      --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
      --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
      --renameFileIfExists true\
      --srcFile src/frontend/assets/staticdata/static.mytbpdocs.js \
      --file src/frontend/assets/staticdata/static.mytbpdocs.json \
      --debug 1
node dist/backend/serverAdmin.js\
      --command convertPDoc\
      --action migrateLegacyPDocFile\
      --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
      --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
      --renameFileIfExists true\
      --srcFile src/frontend/assets/staticdata/static.mytbpdocs.json \
      --langkeys lang_de,lang_en \
      --profiles ${PROFILES} \
      --file src/frontend/assets/staticdata/static.mytbpdocs.json \
      --debug 1
node dist/backend/serverAdmin.js\
      --command convertPDoc\
      --action createPDocViewerFile\
      --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
      --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
      --renameFileIfExists true\
      --srcFile src/frontend/assets/staticdata/static.mytbpdocs.json \
      --file src/frontend/assets/staticdata/static.mytbpdocs.js \
      --exportId assets/staticdata/static.mytbpdocs.js \
      --debug 1
```

#### if you will use: use database based pdoc-managameent
- migrate files to import-formt and import into database
```
CONFIG_BASEDIR=./config/
CONFIGPROFILE=dev
PDOCS_TMP_BASEDIR=/tmp/
LANG=de
PROFILE=dev
node dist/backend/serverAdmin.js\
      --command convertPDoc\
      --action migratePDocFileToMapperFile\
      --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
      --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
      --renameFileIfExists true\
      --srcFile config/pdocs-${LANG}.json \
      --file ${PDOCS_TMP_BASEDIR}pdocs-${PROFILE}-${LANG}-import.json\
      --debug 1
node dist/backend/serverAdmin.js\
      --command loadPDoc\
      --action loadDocs\
      --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
      --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
      --renameFileAfterSuccess true\
      --file ${PDOCS_TMP_BASEDIR}pdocs-${PROFILE}-${LANG}-import.json \
      --debug 1

LANG=en
PROFILE=dev
node dist/backend/serverAdmin.js\
      --command convertPDoc\
      --action migratePDocFileToMapperFile\
      --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
      --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
      --renameFileIfExists true\
      --srcFile config/pdocs-${LANG}.json \
      --file ${PDOCS_TMP_BASEDIR}pdocs-${PROFILE}-${LANG}-import.json\
      --debug 1
node dist/backend/serverAdmin.js\
      --command loadPDoc\
      --action loadDocs\
      --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
      --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
      --renameFileAfterSuccess true\
      --file ${PDOCS_TMP_BASEDIR}pdocs-${PROFILE}-${LANG}-import.json \
      --debug 1

LANG=de
PROFILE=static
node dist/backend/serverAdmin.js\
      --command convertPDoc\
      --action migratePDocFileToMapperFile\
      --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
      --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
      --renameFileIfExists true\
      --srcFile src/frontend/assets/pdocs.json \
      --file ${PDOCS_TMP_BASEDIR}pdocs-${PROFILE}-${LANG}-import.json\
      --debug 1
node dist/backend/serverAdmin.js\
      --command loadPDoc\
      --action loadDocs\
      --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
      --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
      --renameFileAfterSuccess true\
      --file ${PDOCS_TMP_BASEDIR}pdocs-${PROFILE}-${LANG}-import.json \
      --debug 1


LANG=de
PROFILE=viewer
node dist/backend/serverAdmin.js\
      --command convertPDoc\
      --action migratePDocFileToMapperFile\
      --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
      --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
      --renameFileIfExists true\
      --srcFile src/frontend/assets/staticdata/static.mytbpdocs.json \
      --file ${PDOCS_TMP_BASEDIR}pdocs-${PROFILE}-${LANG}-import.json\
      --debug 1
node dist/backend/serverAdmin.js\
      --command loadPDoc\
      --action loadDocs\
      --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
      --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
      --renameFileAfterSuccess true\
      --file ${PDOCS_TMP_BASEDIR}pdocs-${PROFILE}-${LANG}-import.json \
      --debug 1
```
- export files from database to current configs
```
./sbin/export-pdocs-current.sh
```
- export files from database to sources
```
./sbin/export-pdocs-for-build.sh
```
