#!/bin/bash
MYSCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

CONFIG_BASEDIR=config/
MYTB=${MYSCRIPTPATH}/../
MYTBTOOLS=${MYTB}/sbin/
LIRETOOLS=/cygdrive/f/Projekte/liretools/

DIGIFOTOS_BASEDIR=/cygdrive/f/playground/mytb-test/Bilder/digifotos/
VIDEOS_BASEDIR=/cygdrive/f/playground/mytb-test/Bilder/Videos/
EXPORT_BASEDIR=/cygdrive/f/playground/mytb-test/export/
MYTB_IMPORT_MEDIADIR=/cygdrive/f/playground/mytb-test/mytbbase/
MYTB_MEDIADIR=/cygdrive/f/playground/mytb-test/mytbmediabase/
MYTB_INDEXDIR=/cygdrive/f/playground/mytb-test/mytbindex/
MYTB_INDEXSRC_MEDIADIR=${MYTB_MEDIADIR}pics_x100/

W_CONFIG_BASEDIR="config\\"
W_MYTB="..\\"
W_MYTBTOOLS="${W_MYTB}\\sbin\\"
W_LIREOOLS="F:\\Projekte\\liretools\\"

W_DIGIFOTOS_BASEDIR="F:\\playground\\mytb-test\\Bilder\\digifotos\\"
W_VIDEOS_BASEDIR="F:\\playground\\mytb-test\\Bilder\\Videos\\"
W_EXPORT_BASEDIR="F:\\playground\\mytb-test\\export\\"
W_MYTB_IMPORT_MEDIADIR="F:\\playground\\mytb-test\\mytbbase\\"
W_MYTB_MEDIADIR="F:\\playground\\mytb-test\\mytbmediabase\\"
W_MYTB_INDEXDIR="F:\\playground\\mytb-test\\mytbindex\\"
W_MYTB_INDEXSRC_MEDIADIR="${W_MYTB_MEDIADIR}pics_x100\\"

SOLR_PORT=9999
SOLR_JETTY_HOST=127.0.0.1
SOLR_HOST=127.0.0.1
SOLR_OPTS=-Dsolr.jetty.request.header.size=65535
START_ADMINSERVER=true

AUTOSTARTIMPORT=false
AUTOSTARTEXPORT=true
