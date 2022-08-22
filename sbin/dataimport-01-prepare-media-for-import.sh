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
    dofail "USAGE: dataimport-01-prepare-media-for-import.sh IMPORTKEY\nFATAL: requires 'IMPORTKEY' as parameters 'import-XXXX'" 1
    exit 1
fi
IMPORTKEY=$1

echo "start - prepare media for import: ${IMPORTKEY}"

echo "now: configure linux vars: run sbin/configure-environment.sh"
source ${SCRIPTPATH}/configure-environment.bash

echo ""
echo ""
echo "##########################"
echo "OPEN: Do you want to prepare media for import '${MYTB_IMPORT_MEDIADIR}/${IMPORTKEY}'?"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) break;;
        No ) exit;;
    esac
done

echo "now: configure import linux vars: run sbin/configure-import-environment.sh"
source ${SCRIPTPATH}/configure-import-environment.bash ${IMPORTKEY}

echo "now: set workingdir to '${IMPORTKEY_BASEDIR}'"
${SCRIPTPATH}/setImportDirectory.sh $IMPORTKEY

echo "now: prepare environment for '${MYTB_IMPORT_MEDIADIR}/${IMPORTKEY}'"
source ${SCRIPTPATH}/prepare-environment.sh ${IMPORTKEY}

echo ""
echo ""
echo "##########################"
echo "YOUR TODO: copy your images/videos to folder '${IMPORT_BASEDIR_SRC}'?"
echo "##########################"
echo "OPEN: Do you want to prepare file in '${IMPORT_BASEDIR_SRC}'?"
select yn in "Yes" "No"; do
    case $yn in
        Yes ) break;;
        No ) exit;;
    esac
done

${SCRIPTPATH}/prepare-media-for-import.sh ${IMPORTKEY}

echo "done - prepare media for import: ${IMPORTDIR} to '${IMPORTKEY_BASEDIR}'"
