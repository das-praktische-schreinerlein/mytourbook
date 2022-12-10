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


# TODO remove when script is functional
# check parameters
if [ "$#" -lt 2 ]; then
    dofail "USAGE: prepareExportFileForStaticData.sh BASEFILE DESTDIR RESULTBASE\nFATAL: requires 'BASEFILE' as parameters 'import-XXXX'" 1
    exit 1
fi
BASEFILE=$1
DESTDIR=$2
RESULTBASE=${3:-static.mytbtdocs_export_chunk}

source ${SCRIPTPATH}/configure-environment.bash

if [ ! -d "${DESTDIR}" ]; then
    dofail "USAGE: prepareExportFileForStaticData.sh DESTDIR\nFATAL: $DESTDIR must exists" 1
    exit 1
fi

if [ "${RESULTBASE}" == "" ]; then
    dofail "USAGE: prepareExportFileForStaticData.sh RESULTBASE\nFATAL: RESULTBASE must defined" 1
    exit 1
fi


echo "start - preparing $RESULTBASE"

echo "now: split by 100 entries: '$BASEFILE'"
cd ${DESTDIR}
rm -f ${RESULTBASE}*.js
grep $BASEFILE -e "  {\"id\":\"" | awk -v RESULTBASE=$RESULTBASE 'BEGIN { RESULTBASE = RESULTBASE } /{"id":"/ { delim++ } { file = sprintf("%s%s.js", RESULTBASE, int(delim / 100)); print >> file; }'
[ -s  ${RESULTBASE}0.js ] || echo "{}," > ${RESULTBASE}0.js


for CHUNKFILE in ${RESULTBASE}*.js; do
  INSECURE_LINES=`grep -P '<[\s/]*s\s*c\s*r\s*i\s*p\s*t.*>' "$CHUNKFILE" & true`
  INSECURE_LINES2=`grep -P '<[\s/]*s\s*t\s*y\s*l\s*e.*>' "$CHUNKFILE" & true`
  if [ "$INSECURE_LINES$INSECURE_LINES2" != "" ]; then
    echo "INSECURE: $INSECURE_LINES$INSECURE_LINES2"
    dofail "ERROR found insecure script-tag in '$CHUNKFILE" 1
    exit 1
  fi

  echo "preparing $CHUNKFILE"
  sed -i 's/`/''/g' $CHUNKFILE
  sed -i '1s/^/window.importStaticDataTDocsJsonP = \`{ "mdocs": [\n/' $CHUNKFILE
  sed -i 's/\\/\\\\/g' $CHUNKFILE
  sed -i 's/\}\]\}[ \r\n]*$/},/g' $CHUNKFILE
  echo '{}]}`;' >> $CHUNKFILE
  echo "var script = document.createElement('script');
        script.type='application/json';
        script.id = '$CHUNKFILE';
        var text = document.createTextNode(importStaticDataTDocsJsonP);
        script.appendChild(text);
        document.head.appendChild(script);" >> $CHUNKFILE
  #echo "head and tail of $CHUNKFILE"
  #head -n 2 $CHUNKFILE
  #tail -n 2 $CHUNKFILE
done
cd ${CWD}

echo "done - preparing $RESULTBASE"
