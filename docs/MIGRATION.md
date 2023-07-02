# Migration-Hints for MyTourBook

## Version 7 -> 8.0.0

### migrate page-documents

#### migrate legacy docs-files to new format
- migrate legacy docs-files to new format
```
PDOC_BASEDIR=./config/
#PDOC_BASEDIR=../overrides/after-build/config/

CONFIG_BASEDIR=./config/
CONFIGPROFILE=dev
PROFILES=profile_dev,profile_import,profile_beta,profile_prod
PDOCS_TMP_BASEDIR=/tmp/

node dist/backend/serverAdmin.js\
      --command convertPDoc\
      --action migrateLegacyPDocFile\
      --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
      --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
      --renameFileIfExists true\
      --srcFile ${PDOC_BASEDIR}pdocs-de.json \
      --langkeys lang_de \
      --profiles ${PROFILES} \
      --file ${PDOC_BASEDIR}pdocs-de.json\
      --debug 1
node dist/backend/serverAdmin.js\
      --command convertPDoc\
      --action migrateLegacyPDocFile\
      --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
      --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
      --renameFileIfExists true\
      --srcFile ${PDOC_BASEDIR}pdocs-en.json \
      --langkeys lang_en \
      --profiles ${PROFILES} \
      --file ${PDOC_BASEDIR}pdocs-en.json\
      --debug 1

PDOC_BASEDIR=./src/frontend/assets/
#PDOC_BASEDIR=../overrides/before-build/src/frontend/assets/

PROFILES=profile_static
node dist/backend/serverAdmin.js\
      --command convertPDoc\
      --action migrateLegacyPDocFile\
      --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
      --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
      --renameFileIfExists true\
      --srcFile ${PDOC_BASEDIR}pdocs.json \
      --langkeys lang_de,lang_en \
      --profiles ${PROFILES} \
      --file ${PDOC_BASEDIR}pdocs.json \
      --debug 1

PROFILES=profile_viewer
node dist/backend/serverAdmin.js\
      --command convertPDoc\
      --action extractPDocViewerFile\
      --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
      --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
      --renameFileIfExists true\
      --srcFile ${PDOC_BASEDIR}staticdata/static.mytbpdocs.js \
      --file ${PDOCS_TMP_BASEDIR}static.mytbpdocs-${PROFILE}-${LANG}.json \
      --debug 1
node dist/backend/serverAdmin.js\
      --command convertPDoc\
      --action migrateLegacyPDocFile\
      --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
      --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
      --renameFileIfExists true\
      --srcFile  ${PDOCS_TMP_BASEDIR}static.mytbpdocs-${PROFILE}-${LANG}.json \
      --langkeys lang_de,lang_en \
      --profiles ${PROFILES} \
      --file  ${PDOCS_TMP_BASEDIR}static.mytbpdocs-${PROFILE}-${LANG}.json \
      --debug 1
node dist/backend/serverAdmin.js\
      --command convertPDoc\
      --action createPDocViewerFile\
      --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
      --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
      --renameFileIfExists true\
      --srcFile ${PDOCS_TMP_BASEDIR}static.mytbpdocs-${PROFILE}-${LANG}.json \
      --file ${PDOC_BASEDIR}staticdata/static.mytbpdocs.js \
      --exportId assets/staticdata/static.mytbpdocs.js \
      --debug 1
```

#### if you will use: use database based pdoc-managameent
- migrate files to import-formt and import into database
```
PDOC_BASEDIR=./config/
#PDOC_BASEDIR=../overrides/after-build/config/

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
      --srcFile ${PDOC_BASEDIR}pdocs-${LANG}.json \
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
      --srcFile ${PDOC_BASEDIR}pdocs-${LANG}.json \
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

PDOC_BASEDIR=./src/frontend/assets/
#PDOC_BASEDIR=../overrides/before-build/src/frontend/assets/

LANG=de
PROFILE=static
node dist/backend/serverAdmin.js\
      --command convertPDoc\
      --action migratePDocFileToMapperFile\
      --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
      --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
      --renameFileIfExists true\
      --srcFile ${PDOC_BASEDIR}pdocs.json \
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
      --action extractPDocViewerFile\
      --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
      --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
      --renameFileIfExists true\
      --srcFile ${PDOC_BASEDIR}staticdata/static.mytbpdocs.js \
      --file ${PDOCS_TMP_BASEDIR}static.mytbpdocs-${PROFILE}-${LANG}.json \
      --debug 1
node dist/backend/serverAdmin.js\
      --command convertPDoc\
      --action migratePDocFileToMapperFile\
      --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
      --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
      --renameFileIfExists true\
      --srcFile ${PDOCS_TMP_BASEDIR}static.mytbpdocs-${PROFILE}-${LANG}.json \
      --file ${PDOCS_TMP_BASEDIR}static.mytbpdocs-${PROFILE}-${LANG}-import.json\
      --debug 1
node dist/backend/serverAdmin.js\
      --command loadPDoc\
      --action loadDocs\
      --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
      --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
      --renameFileAfterSuccess true\
      --file ${PDOCS_TMP_BASEDIR}static.mytbpdocs-${PROFILE}-${LANG}-import.json \
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
- potentially export to overrides in another dir
```
./sbin/exportPDocs4SrcConfig.sh dev ../overrides/before-build/
./sbin/exportPDocs4BackendConfig.sh dev ../overrides/after-build/config/ de
./sbin/exportPDocs4BackendConfig.sh dev ../overrides/after-build/config/ en
./sbin/exportPDocs4DistConfig.sh dev ../overrides/after-build/dist/ de noinline
./sbin/exportPDocs4DistConfig.sh dev ../overrides/after-build/dist/ en noinline
```
