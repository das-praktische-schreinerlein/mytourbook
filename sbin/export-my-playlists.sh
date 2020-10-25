#!/bin/bash
# exit on error
set -e
CWD=$(pwd)
SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

${SCRIPTPATH}/dataexport-playlist.sh "D:\\export\\Bilder\\favorites" "Favorites" "favorites" "prod"
${SCRIPTPATH}/dataexport-playlist.sh "D:\\export\\Bilder-flat\\main-favorites" "kategorie_favorites" "main-favorites" "fullonly" "flat" "flat"
