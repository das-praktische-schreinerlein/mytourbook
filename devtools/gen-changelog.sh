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

LOGFROM=2017-01-05
LOGFOR=release-201707

# load utils
source ${SCRIPTPATH}/utils.bash

# check params
BASEPATH=$1
if [ "$#" -lt 1 ]; then
  BASEPATH=$SCRIPTPATH/..
fi

if [ ! -d "${BASEPATH}/.git" ]; then
    dofail "USAGE: gen-changelog.sh [BASEDIR] \nFATAL: BASEDIR not exists or is no valid git-project " 1
fi

cd ${BASEPATH}
GITORIGIN=local
GITBASE=`git config --get remote.${GITORIGIN}.url`
GITPROJECT=`basename -s .git ${GITBASE}`

DISTBASE=${BASEPATH}/dist/
DOCBASE=${BASEPATH}/docs/

echo "start - generate changelog for '${GITPROJECT}' to '${BASEPATH}/dist/'"

# gen changelog.wiki
git log --since=$LOGFROM --date=short --reverse --format="*** ERLEDIGT - %s [Ist: 100%% 1h %ad-%ad] [Plan: 1h %ad-%ad] [NodeMeta: ,,,TaskNodeMetaNodeSubType.TASK]\n# Aufgabe\n- %s\n\n## Stand\n- [ERLEDIGT] - Konzept\n- [ERLEDIGT] - Umsetzung\n\n## Konzept\n" > ${DISTBASE}gitlog.tmp
cat ${DISTBASE}gitlog.tmp | sed -r -e "s/([0-9]{4})-([0-9]{2})-([0-9]{2})/\3.\2.\1/g" > ${DISTBASE}gitchangelog-$LOGFOR.wiki

# get release-dates
git log --grep=released --date=short --reverse --format="%s (%ad)" > ${DISTBASE}releases.gitlog

# get only summary see https://stackoverflow.com/questions/3717772/regex-grep-for-multi-line-search-needed
sed -e "s/\r//gm" ${DOCBASE}CHANGELOG.md | sed 's/^[[:blank:]]*//;s/[[:blank:]]*$//' | grep -Pzo "(?s)## (\d.\d.\d \(.*?\))[\r\n]+(.*?)+[\r\n]+#" | sed -e "s/#\x00//gm"> ${DISTBASE}CHANGELOG-summary.md
sed ':a;N;$!ba;s/\n/__/g' ${DISTBASE}CHANGELOG-summary.md | sed -e "s/__-/; -/gm" | sed -r -e "s/(__)+/\n/gm" | sed -e "s/^##/## ${GITPROJECT}/gm"  > ${DISTBASE}CHANGELOG-summary-short.md
sed -r -e 's/## ([-a-zA-Z0-9_.]+?) ([0-9.]+?) \(([0-9]+?)-([0-9]+?)-([0-9]+?)\); (.*)/- \4 \3: :\|: [\1 - \2](https:\/\/github.com\/das-praktische-schreinerlein\/\1\/releases\/tag\/\2) \6/gm' ${DISTBASE}CHANGELOG-summary-short.md > ${DISTBASE}CHANGELOG-news.md

cd $CWD
