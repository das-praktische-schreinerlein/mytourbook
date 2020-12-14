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

echo "start - indexing mytb-images"
LIRESEARCHER_NUMTHREADS=8
LIRESEARCHER_FEATURES=OpponentHistogram,ColorLayout,SimpleColorHistogram
LIRESEARCHER_MAXDIFFERENCESCORE=30
LIRESEARCHER_SHOWSIMILARHITS=10

echo "now: configure linux vars: run sbin/configure-environment.sh"
source ${SCRIPTPATH}/configure-environment.bash

echo "now: running indexing similar mytb-images in '$MYTB_INDEXDIR'"
cd ${LIRETOOLS}/sbin
rm -f "$MYTB_INDEXDIR/indexSimilarFilesInLireIndex.tmp"
rm -f "$MYTB_INDEXDIR/indexSimilarFilesInLireIndex.json"
${LIRETOOLS}/sbin/indexSimilarImages.sh "$MYTB_INDEXDIR" "$W_MYTB_INDEXDIR" "$LIRESEARCHER_FEATURES" "$LIRESEARCHER_MAXDIFFERENCESCORE" "$LIRESEARCHER_SHOWSIMILARHITS" "$LIRESEARCHER_NUMTHREADS"
rm -f "$MYTB_INDEXDIR/indexSimilarFilesInLireIndex.tmp"
cd ${CWD}

echo "now: split by 10000 entries: '$MYTB_INDEXDIR/indexSimilarFilesInLireIndex.json'"
cd ${MYTB_INDEXDIR}
rm -f indexSimilarFilesInLireIndex_chunk*.json
awk '/{  "file":/ { f = 1 } f' < indexSimilarFilesInLireIndex.json | sed -n '/dummydir",   "name": "dummyfile"/q;p' | awk '/"file":/ { delim++ } { file = sprintf("indexSimilarFilesInLireIndex_chunk%s.json", int(delim / 10000)); print >> file; }'

for CHUNKFILE in indexSimilarFilesInLireIndex_chunk*.json; do
  sed -i '1s/^/{  "files": [\n/' $CHUNKFILE
  echo '{  "file":     {  "dir": "F:\\Projekte\\liretools\\dummydir",   "name": "dummyfile"}, "records":     []}  ]}' >> $CHUNKFILE
  head -n 3 $CHUNKFILE
  tail -n 3 $CHUNKFILE
cd ${MYTB}
  echo "now: import similarity images in database: '$W_MYTB_INDEXDIR/$CHUNKFILE'"
  rm -f $MYTB_INDEXDIR/$CHUNKFILE.log
  node dist/backend/serverAdmin.js -c ${CONFIG_BASEDIR}backend.dev.json --command mediaManager --action insertSimilarMatchings --debug true --additionalMappingsFile $W_MYTB_INDEXDIR/$CHUNKFILE > "$MYTB_INDEXDIR/$CHUNKFILE.log"
done
cd ${CWD}

echo "done - indexing similar mytb-images"
