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
if [ "$#" -lt 1 ]; then
    dofail "USAGE: prepareViewerFileForStaticData.sh DESTDIR [RESULTBASE RESULTFILE]\nFATAL: requires DESTDIR as parameters 'import-XXXX'" 1
    exit 1
fi
DESTDIR=$1
RESULTBASE=${2:-static.mytbtdocs_export_chunk}
RESULTFILE=${3:-index.viewer.full.html}

source ${SCRIPTPATH}/configure-environment.bash

if [ ! -d "${DESTDIR}" ]; then
    dofail "USAGE: prepareViewerFileForStaticData.sh DESTDIR\nFATAL: $DESTDIR must exists" 1
    exit 1
fi

if [ "${RESULTBASE}" == "" ]; then
    dofail "USAGE: prepareViewerFileForStaticData.sh RESULTBASE\nFATAL: RESULTBASE must defined" 1
    exit 1
fi

echo "start - preparing ${DESTDIR}/index.viewer.full for ${RESULTBASE}"

echo "running - coping ${DESTDIR}/index.viewer.full"
cp ${SCRIPTPATH}/../dist/static/mytbviewer/de/index.viewer.full.html  ${DESTDIR}/index.viewer.full.tmp

echo "running - removing samples from config in ${DESTDIR}/index.viewer.full"
sed -i "s/staticTDocsFiles\": \[.*\"tracksBaseUrl/staticTDocsFiles\": \[\"assets\/staticdata\/samples-static.mytbtdocs_videos_export_chunk0.js\"], \"tracksBaseUrl/"  ${DESTDIR}/index.viewer.full.tmp

echo "running - configure assets-path ${DESTDIR}/index.viewer.full"
sed -i "s/\"tracksBaseUrl\": .* \"videoBaseUrl\": \"assets\/staticdata\/\"/\"tracksBaseUrl\": \".\/tracks\/\",    \"picsBaseUrl\": \".\/\",    \"videoBaseUrl\": \".\/\"/"  ${DESTDIR}/index.viewer.full.tmp

cd ${DESTDIR}
for CHUNKFILE in $(/usr/bin/find ./ -name "${RESULTBASE}*.js" -printf "%f\n"); do
  echo "add $CHUNKFILE to ${DESTDIR}/index.viewer.full.html"
  sed -z -E -i "s/<\/head>/\n  <script inlineexport type=\"text\/javascript\" src=\"$CHUNKFILE\"><\/script>\n<\/head>/"  ${DESTDIR}/index.viewer.full.tmp
  sed -z -E -i "s/staticTDocsFiles\": \[/staticTDocsFiles\": \[\"$CHUNKFILE\", /"  ${DESTDIR}/index.viewer.full.tmp
done

echo "inline all ${DESTDIR}/index.viewer.full.html"
cd ${SCRIPTPATH}
node --max-old-space-size=8192 ../devtools/create-allinone-html.js ${DESTDIR}/index.viewer.full.tmp ${DESTDIR}/${RESULTFILE} inlineexport
rm ${DESTDIR}/index.viewer.full.tmp
cd ${CWD}

echo "done - preparing ${DESTDIR}/index.viewer.full for ${RESULTBASE}"
