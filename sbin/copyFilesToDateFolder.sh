#!/bin/bash
# exit on error
set -e

# check parameters
if [ "$#" -ne 2 ]; then
    echo "copy files from srcDir to destDir (create destDir if not exists) and create separate subdirs by date"
    echo "FATAL: requires 'srcDir destDir' as parameters"
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
