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
    dofail "copy only videos from srcDir to destDir (create destDir if not exists)\nFATAL: requires 'srcDir destDir' as parameters" 1
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

pmv(){
    source=$1;
    target=$2;
    mkdir -p "$target"/"$(dirname $source)"
    mv "$source" "$target"/"$(dirname $source)"/
}

# do it
cd "${SRCDIR}"
/usr/bin/find ./ -name \*.mp4 -type f -exec  cp -a --parents {} "${DESTDIR}"/ \; -exec  rm {} \;
/usr/bin/find ./ -name \*.MP4 -type f -exec  cp -a --parents {} "${DESTDIR}"/ \; -exec  rm {} \;
/usr/bin/find ./ -name \*.mov -type f -exec  cp -a --parents {} "${DESTDIR}"/ \; -exec  rm {} \;
/usr/bin/find ./ -name \*.MOV -type f -exec  cp -a --parents {} "${DESTDIR}"/ \; -exec  rm {} \;
cd "${CWD}"
