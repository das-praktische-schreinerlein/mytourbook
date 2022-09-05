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
if [ "$#" -ne 2 ]; then
    dofail "USAGE: prepareExportFileForStaticData.sh BASEFILE DESTDIR\nFATAL: requires 'BASEFILE' as parameters 'import-XXXX'" 1
    exit 1
fi
BASEFILE=$1
DESTDIR=$2

if [ ! -d "${DESTDIR}" ]; then
    dofail "USAGE: prepareExportFileForStaticData.sh DESTDIR\nFATAL: $DESTDIR must exists" 1
    exit 1
fi


echo "start - preparing static.mytbtdocs_export_chunk"
echo "now: split by 100 entries: '$BASEFILE'"
cd ${DESTDIR}
rm -f static.mytbtdocs_chunk*.js
#awk '/{"id":"/ { f = 1 } f' < $BASEFILE | sed -n '/dummydir","name":"dummyfile"/q;p' | awk '/"file":/ { delim++ } { file = sprintf("$BASEFILE%s.js", int(delim / 10000)); print >> file; }'
grep $BASEFILE -e "  {\"id\":\"" | awk '/{"id":"/ { delim++ } { file = sprintf("static.mytbtdocs_export_chunk%s.js", int(delim / 100)); print >> file; }'

for CHUNKFILE in static.mytbtdocs_export_chunk*.js; do
  sed -i '1s/^/window.importStaticDataTDocsJsonP = \`{ "mdocs": [\n/' $CHUNKFILE
  sed -i 's/\\/\\\\/g' $CHUNKFILE
  sed -i 's/\}\]\}[ \r\n]*$/},/g' $CHUNKFILE
  echo '{}]}`;' >> $CHUNKFILE
  echo "head and tail of $CHUNKFILE"
  head -n 2 $CHUNKFILE
  tail -n 2 $CHUNKFILE
done
cd ${CWD}

echo "done - preparing static.mytbtdocs_export_chunk"
