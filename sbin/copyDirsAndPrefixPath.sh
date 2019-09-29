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
if [ "$#" -ne 3 ]; then
    dofail "copy subdirs from srcDir to destDir (create destDir if not exists) and prefix the subdirs with prefix\nFATAL: requires 'srcDir destDir prefix' as parameters" 1
    exit 1
fi
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
