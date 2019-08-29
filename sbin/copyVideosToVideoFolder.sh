#!/bin/bash
# exit on error
set -e

# check parameters
if [ "$#" -ne 2 ]; then
    echo "copy only videos from srcDir to destDir (create destDir if not exists)"
    echo "FATAL: requires 'srcDir destDir' as parameters"
    exit 1
fi
CWD=$(pwd)
SRCDIR=$1
DESTDIR=$2

if [ ! -d "$SRCDIR" ]; then
  echo "FATAL: srcDir ${SRCDIR} must exist"
  exit 1
fi
if [ ! -d "$DESTDIR" ]; then
  mkdir -p "${DESTDIR}"
fi

# do it
cd "${SRCDIR}"
/usr/bin/find ./ -name \*.mp4 -type f -exec  cp --parents {} "${DESTDIR}"/ \;
/usr/bin/find ./ -name \*.MP4 -type f -exec  cp --parents {} "${DESTDIR}"/ \;
/usr/bin/find ./ -name \*.mov -type f -exec  cp --parents {} "${DESTDIR}"/ \;
/usr/bin/find ./ -name \*.MOV -type f -exec  cp --parents {} "${DESTDIR}"/ \;
cd "${CWD}"
