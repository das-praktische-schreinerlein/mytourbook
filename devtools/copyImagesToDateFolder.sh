#!/bin/bash
SRCDIR=$1
DESTDIR=$2

for x in $SRCDIR/*; do
  d=$(date -r "$x" +%Y%m%d)
  mkdir -p "$DESTDIR/$d"
  cp -a "$x" "$DESTDIR/$d/"
done