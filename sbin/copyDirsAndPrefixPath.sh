#!/bin/bash
# exit on error
set -e

# check parameters
if [ "$#" -ne 3 ]; then
    echo "copy subdirs from srcDir to destDir (create destDir if not exists) and prefix the subdirs with prefix"
    echo "FATAL: requires 'srcDir destDir prefix' as parameters"
    exit 1
fi
CWD=$(pwd)
SRCDIR=$1
DESTDIR=$2
PREFIX=$3

echo "start: copy subdirs from $SRCDIR to $DESTDIR with $PREFIX"

if [ ! -d "$SRCDIR" ]; then
  echo "FATAL: srcDir ${SRCDIR} must exist"
  exit 1
fi
if [ ! -d "$DESTDIR" ]; then
  mkdir -p "${DESTDIR}"
fi

# copy to tmp
TMPDIR=${DESTDIR}/_tmp/
mkdir -p "$TMPDIR"
cp -ra "${SRCDIR}"/* "${TMPDIR}"

# prefix in tmp
BASEDIR=${TMPDIR}
cd "$BASEDIR"
for f in * ; do mv "$f" "$PREFIX$f" ; done

# move from tmp to dest
mv "${TMPDIR}"/* "${DESTDIR}/"
cd "${CWD}"

# cleanup tmp
rmdir "${TMPDIR}"

echo "done: copy subdirs from $SRCDIR to $DESTDIR with $PREFIX"
