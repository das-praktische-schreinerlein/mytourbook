#!/bin/bash
# gen changelog.wiki

LOGFROM=2017-01-05
LOGFOR=release-201707

MYTB_DIR=/cygdrive/d/Projekte/mytourbook

MYTB_FILEBASE=$MYTB_DIR/docs/mytb

SCRIPTPATH=$( cd $(dirname $0) ; pwd -P )

# load utils
source ${SCRIPTPATH}/utils.bash


cd $MYTB_DIR
git log --since=$LOGFROM --date=short --reverse --format="*** ERLEDIGT - %s [Ist: 100%% 1h %ad-%ad] [Plan: 1h %ad-%ad] [NodeMeta: ,,,TaskNodeMetaNodeSubType.TASK]\n# Aufgabe\n- %s\n\n## Stand\n- [ERLEDIGT] - Konzept\n- [ERLEDIGT] - Umsetzung\n\n## Konzept\n" > $MYTB_FILEBASE-gitlog.tmp
cat $MYTB_FILEBASE-gitlog.tmp | sed -r -f $SCRIPTPATH/gen-changelog.sed > $MYTB_FILEBASE-gitchangelog-$LOGFOR.wiki

cd $SCRIPTPATH