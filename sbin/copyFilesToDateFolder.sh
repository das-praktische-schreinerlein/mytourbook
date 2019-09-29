#!/bin/bash
# exit on error
set -e
CWD=$(pwd)
function dofail {
    cd $CWD
    printf '%s\n' "$1" >&2  ## Send message to stderr. Exclude >&2 if you don't want it that way.
    exit "${2-1}"  ## Return a code specified by $2 or 1 by default.
}

# check parameters
if [ "$#" -ne 2 ]; then
    dofail "copy files from srcDir to destDir (create destDir if not exists) and create separate subdirs by date\nFATAL: requires 'srcDir destDir' as parameters" 1
    exit 1
fi

SRCDIR=$1
DESTDIR=$2
if [ ! -d "$SRCDIR" ]; then
  echo "FATAL: srcDir ${SRCDIR} must exist"
  exit 1
fi
if [ ! -d "$DESTDIR" ]; then
  mkdir -p "${DESTDIR}"
fi

if [ -z "$(ls -A $SRCDIR)" ]; then
  echo "SKIP copy files srcDir is empty: $SRCDIR"
  exit;
fi

# do it
for x in $SRCDIR/*; do
  d=$(date -r "$x" +%Y%m%d)
  mkdir -p "$DESTDIR/$d"
  cp -a "$x" "$DESTDIR/$d/"
done
