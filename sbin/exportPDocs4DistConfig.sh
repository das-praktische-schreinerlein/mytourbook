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
if [ "$#" -lt 3 ]; then
    dofail "USAGE: export-pages-dist.sh CONFIGPROFILE, DISTSTATICDIR, LANGKEY\nFATAL: requires CONFIGPROFILE, DISTSTATICDIR, LANGKEY as parameters 'import-XXXX'" 1
    exit 1
fi
CONFIGPROFILE=$1
DISTSTATICDIR=$2
LANGKEY=$3
NOINLINE=$4

if [ ! -d "${DISTSTATICDIR}" ]; then
    dofail "USAGE: export-pages-dist.sh DISTSTATICDIR\nFATAL: $DISTSTATICDIR must exists" 1
    exit 1
fi

source ${SCRIPTPATH}/configure-environment.bash

echo "start - export-pages-dist for ${CONFIGPROFILE} lang:${LANGKEY} to distdir:${DISTSTATICDIR}"

# dist pdocs
mkdir -p "${DISTSTATICDIR}mytbdev/${LANGKEY}/assets/staticdata/"
${SCRIPTPATH}/exportPDocs.sh ${CONFIGPROFILE} "${DISTSTATICDIR}mytbdev/${LANGKEY}/assets/" "pdocs" "lang_${LANGKEY}" "profile_static"
node dist/backend/serverAdmin.js\
     --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
     --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
     --command pageManager\
     --action exportPDocViewerFile\
     --exportName "static.mytbpdocs"\
     --exportDir "${DISTSTATICDIR}mytbdev/${LANGKEY}/assets/staticdata/"\
     --exportId "assets/staticdata/static.mytbpdocs.js"\
     --profiles "profile_static" \
     --langkeys"lang_${LANGKEY}" \
     --debug 1

mkdir -p "${DISTSTATICDIR}mytbbeta/${LANGKEY}/assets/staticdata/"
${SCRIPTPATH}/exportPDocs.sh ${CONFIGPROFILE} "${DISTSTATICDIR}mytbbeta/${LANGKEY}/assets/" "pdocs" "lang_${LANGKEY}" "profile_static"
node dist/backend/serverAdmin.js\
     --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
     --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
     --command pageManager\
     --action exportPDocViewerFile\
     --exportName "static.mytbpdocs"\
     --exportDir "${DISTSTATICDIR}mytbbeta/${LANGKEY}/assets/staticdata/"\
     --exportId "assets/staticdata/static.mytbpdocs.js"\
     --profiles "profile_static" \
     --langkeys"lang_${LANGKEY}" \
     --debug 1

mkdir -p "${DISTSTATICDIR}mytb/${LANGKEY}/assets/staticdata/"
${SCRIPTPATH}/exportPDocs.sh ${CONFIGPROFILE} "${DISTSTATICDIR}mytb/${LANGKEY}/assets/" "pdocs" "lang_${LANGKEY}" "profile_static"
node dist/backend/serverAdmin.js\
     --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
     --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
     --command pageManager\
     --action exportPDocViewerFile\
     --exportName "static.mytbpdocs"\
     --exportDir "${DISTSTATICDIR}mytb/${LANGKEY}/assets/staticdata/"\
     --exportId "assets/staticdata/static.mytbpdocs.js"\
     --profiles "profile_static" \
     --langkeys"lang_${LANGKEY}" \
     --debug 1

mkdir -p "${DISTSTATICDIR}mytbviewer/${LANGKEY}/assets/staticdata"
${SCRIPTPATH}/exportPDocs.sh ${CONFIGPROFILE} "${DISTSTATICDIR}mytbviewer/${LANGKEY}/assets/" "pdocs" "lang_${LANGKEY}" "profile_static"
node dist/backend/serverAdmin.js\
     --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
     --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
     --command pageManager\
     --action exportPDocViewerFile\
     --exportName "static.mytbpdocs"\
     --exportDir "${DISTSTATICDIR}mytbviewer/${LANGKEY}/assets/staticdata/"\
     --exportId "assets/staticdata/static.mytbpdocs.js"\
     --profiles "profile_viewer" \
     --langkeys"lang_${LANGKEY}" \
     --debug 1

if [ "${NOINLINE}" == "" ]; then
  node dist/backend/serverAdmin.js\
       --adminclibackend ${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json\
       --backend ${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json\
       --command mediaManager\
       --action inlineDataOnViewerFile\
       --inlineProfile "all"\
       --srcFile "${DISTSTATICDIR}mytbviewer/${LANGKEY}/index.viewer.html"\
       --outputFile "${DISTSTATICDIR}mytbviewer/${LANGKEY}/index.viewer.full.html"\
       --debug 1
fi

echo "done - export-pages-dist for ${CONFIGPROFILE} lang:${LANGKEY} to distdir:${DISTSTATICDIR}"
