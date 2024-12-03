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

function join_by { local IFS="$1"; shift; echo "$*"; };

echo "now: configure linux vars: run sbin/configure-environment.sh"
source ${SCRIPTPATH}/configure-environment.bash

# check parameters
if [ "$#" -lt 4 ]; then
    dofail "USAGE: export-playlist-pdf.sh CONFIGPROFILE EXPORTDIR EXPORTNAME BASEURL PLAYLISTNAMEFILTER [OPTIONALQUERYPARAMS OPTIONALOVERVIEWURL TOCTEMPLATE SITEMAPCONFIG] \nFATAL: requires 4 parameters " 1
    exit 1
fi

CONFIGPROFILE=$1
EXPORTDIR=$2
EXPORTNAME=$3
BASEURL=$4
PLAYLISTNAMEFILTER=$5
OPTIONALQUERYPARAMS=$6
OPTIONALOVERVIEWURL=$7
TOCTEMPLATE=${8:-$CONFIG_BASEDIR/pdf-toc-template.html}
SITEMAPCONFIG=${9:-$CONFIG_BASEDIR/tdoc-pdfgenerator-de.json}


cd ${MYTB}
if [ ! -d "${EXPORTDIR}" ]; then
    dofail "USAGE: export-playlist-pdf.sh CONFIGPROFILE EXPORTDIR EXPORTNAME BASEURL PLAYLISTNAMEFILTER [OPTIONALQUERYPARAMS OPTIONALOVERVIEWURL TOCTEMPLATE SITEMAPCONFIG]\nFATAL: EXPORTDIR: ${EXPORTDIR} not exists " 1
fi
if [ -d "${EXPORTDIR}/${EXPORTNAME}.pdf" ]; then
    dofail "USAGE: export-playlist-pdf.sh CONFIGPROFILE EXPORTDIR EXPORTNAME BASEURL PLAYLISTNAMEFILTER [OPTIONALQUERYPARAMS OPTIONALOVERVIEWURL TOCTEMPLATE SITEMAPCONFIG]\nFATAL: PLAYLISTFILE: ${EXPORTDIR}/${EXPORTNAME} is directory " 1
fi

CONFGFILE="${CONFIG_BASEDIR}backend.${CONFIGPROFILE}.json"
if [ ! -f "${CONFGFILE}" ]; then
    dofail "USAGE: export-playlist-pdf.sh CONFIGPROFILE EXPORTDIR EXPORTNAME BASEURL PLAYLISTNAMEFILTER [OPTIONALQUERYPARAMS OPTIONALOVERVIEWURL TOCTEMPLATE SITEMAPCONFIG]\nFATAL: CONFGFILE not exists '${CONFGFILE}' " 1
fi
CLICONFGFILE="${CONFIG_BASEDIR}adminCli.${CONFIGPROFILE}.json"
if [ ! -f "${CLICONFGFILE}" ]; then
    dofail "USAGE: export-playlist-pdf.sh CONFIGPROFILE EXPORTDIR EXPORTNAME BASEURL PLAYLISTNAMEFILTER [OPTIONALQUERYPARAMS OPTIONALOVERVIEWURL TOCTEMPLATE SITEMAPCONFIG]\nFATAL: CLICONFGFILE not exists '${CLICONFGFILE}' " 1
fi
if [ ! -f "${TOCTEMPLATE}" ]; then
    dofail "USAGE: export-playlist-pdf.sh CONFIGPROFILE EXPORTDIR EXPORTNAME BASEURL PLAYLISTNAMEFILTER [OPTIONALQUERYPARAMS OPTIONALOVERVIEWURL TOCTEMPLATE SITEMAPCONFIG]\nFATAL: TOCTEMPLATE not exists '${TOCTEMPLATE}' " 1
fi
if [ ! -f "${SITEMAPCONFIG}" ]; then
    dofail "USAGE: export-playlist-pdf.sh CONFIGPROFILE EXPORTDIR EXPORTNAME BASEURL PLAYLISTNAMEFILTER [OPTIONALQUERYPARAMS OPTIONALOVERVIEWURL TOCTEMPLATE SITEMAPCONFIG]\nFATAL: SITEMAPCONFIG not exists '${SITEMAPCONFIG}' " 1
fi

echo "start - export-playlist-pdf $EXPORTNAME: playlist='${PLAYLISTNAMEFILTER}' to '${EXPORTDIR}'"

# not defined "generateExternalInfoPdfs" "generateExternalTripPdfs
ACTIONS=("generateExternalImagePdfs" "generateExternalLocationPdfs" "generateExternalRoutePdfs" "generateExternalTrackPdfs")
for ACTION in "${ACTIONS[@]}"
do
  echo "do - ${ACTION} for playlist='${PLAYLISTNAMEFILTER}' to '${EXPORTDIR}'"
  node dist/backend/serverAdmin.js\
        --debug\
        --command "tdocPdfManager"\
        --action "${ACTION}"\
        --adminclibackend "${CLICONFGFILE}"\
        --backend "${CONFGFILE}"\
        --sitemap "${SITEMAPCONFIG}"\
        --parallel 1\
        --exportName "${EXPORTNAME}"\
        --exportDir "${EXPORTDIR}"\
        --playlists "${PLAYLISTNAMEFILTER}"\
        --baseUrl "${BASEURL}"\
        --tocTemplate "${TOCTEMPLATE}"\
        --showNonBlockedOnly "showall"\
        --queryParams ""
done

echo "do -generatePlaylistAsPdfs for playlist='${PLAYLISTNAMEFILTER}' to '${EXPORTDIR}'"
node dist/backend/serverAdmin.js\
      --command "tdocPdfManager"\
      --action "generatePlaylistAsPdfs"\
      --adminclibackend "${CLICONFGFILE}"\
      --backend "${CONFGFILE}"\
      --sitemap "${SITEMAPCONFIG}"\
      --parallel 50\
      --exportName "${EXPORTNAME}"\
      --exportDir "${EXPORTDIR}"\
      --playlists "${PLAYLISTNAMEFILTER}"\
      --baseUrl "${BASEURL}"\
      --tocTemplate "${TOCTEMPLATE}"\
      --showNonBlockedOnly "showall"\
      --generateMergedPdf true\
      --addPageNumsStartingWith 1\
      --queryParams ""

echo "do - webshotToPdf toc for 'file:///${EXPORTDIR}/${EXPORTNAME}-toc.html' to '${EXPORTDIR}'"
node dist/backend/serverAdmin.js\
      --command "pdocPdfManager"\
      --action "webshotToPdf"\
      --adminclibackend "${CLICONFGFILE}"\
      --backend "${CONFGFILE}"\
      --sitemap "${SITEMAPCONFIG}"\
      --baseUrl "file:///${EXPORTDIR}/${EXPORTNAME}-toc.html"\
      --destFile "${EXPORTDIR}/${EXPORTNAME}-toc.pdf"

SRCFILES="${EXPORTDIR}/${EXPORTNAME}-toc.pdf,${EXPORTDIR}/${EXPORTNAME}.pdf"
if [ "${OPTIONALOVERVIEWURL}" != "" ]; then
  echo "do - webshotToPdf routelist for '$OPTIONALOVERVIEWURL' to '${EXPORTDIR}'"
  node dist/backend/serverAdmin.js\
        --command "pdocPdfManager"\
        --action "webshotToPdf"\
        --adminclibackend "${CLICONFGFILE}"\
        --backend "${CONFGFILE}"\
        --sitemap "${SITEMAPCONFIG}"\
        --baseUrl "$OPTIONALOVERVIEWURL"\
        --destFile "${EXPORTDIR}/${EXPORTNAME}-routenliste.pdf"

  SRCFILES="${EXPORTDIR}/${EXPORTNAME}-toc.pdf,${EXPORTDIR}/${EXPORTNAME}-routenliste.pdf,${EXPORTDIR}/${EXPORTNAME}.pdf"
fi

echo "do - mergePdfs routelist for '$SRCFILES' to '${EXPORTDIR}/${EXPORTNAME}-a4.pdf'"
node dist/backend/serverAdmin.js\
      --debug\
      --command "pdocPdfManager"\
      --action "mergePdfs"\
      --adminclibackend "${CLICONFGFILE}"\
      --backend "${CONFGFILE}"\
      --sitemap "${SITEMAPCONFIG}"\
      --trimEmptyPages false\
      --srcFiles "${SRCFILES}"\
      --destFile "${EXPORTDIR}/${EXPORTNAME}-a4.pdf"

echo "done - export-playlist-pdf $EXPORTNAME: playlist='${PLAYLISTNAMEFILTER}' to '${EXPORTDIR}/${EXPORTNAME}-a4.pdf'"
