#!/usr/bin/env bash

WORKSPACE="/cygdrive/f/Projekte/"
MYCMSPROJECT="mytourbook_upgrade"

#echo "STEP: build commons"
#cd ${WORKSPACE}mycms-commons
#mv _node_modules node_modules & mv node_modules/_@angular node_modules/@angular & mv node_modules/_rxjs node_modules/rxjs
# npm prune || exit
# rem npm install || exit
# npm run build || exit
# npm link || exit

#echo "STEP: build frontend-commons"
#cd ${WORKSPACE}mycms-frontend-commons
#mv _node_modules node_modules & mv node_modules/_@angular node_modules/@angular & mv node_modules/_rxjs node_modules/rxjs
#npm unlink @dps/mycms-commons || exit
#npm prune || exit
#npm install || exit
#npm link @dps/mycms-commons || exit
#npm run build || exit
#npm link || exit

#echo "STEP: build server-commons"
#cd ${WORKSPACE}mycms-server-commons
# mv _node_modules node_modules & mv node_modules/_@angular node_modules/@angular & mv node_modules/_rxjs node_modules/rxjs
#npm unlink @dps/mycms-commons || exit
#npm prune || exit
#npm install || exit
#npm link @dps/mycms-commons || exit
#npm run build || exit
#npm link || exit

#echo "STEP: unlink commons"
#cd ${WORKSPACE}${MYCMSPROJECT}
#npm unlink @dps/mycms-commons || exit
#npm unlink @dps/mycms-frontend-commons || exit
#npm unlink @dps/mycms-server-commons || exit

#echo "STEP: install node_modules"
#cd ${WORKSPACE}${MYCMSPROJECT}
# npm prune || exit
# npm install || exit
#npm link @dps/mycms-commons || exit
#npm link @dps/mycms-frontend-commons || exit
#npm link @dps/mycms-server-commons || exit

echo "STEP: build server -> they need the node_modules"
cd ${WORKSPACE}${MYCMSPROJECT}
npm run backend-build || exit
npm run frontendserver-build-server-dev-de || exit
npm run frontendserver-build-admin-dev-de || exit

#echo "STEP: backup redundant node_modules"
#cd ${WORKSPACE}mycms-commons
#mv node_modules/@angular node_modules/_@angular & mv node_modules/rxjs node_modules/_rxjs
#mv node_modules _node_modules
#cd ${WORKSPACE}mycms-frontend-commons
#mv node_modules/@angular node_modules/_@angular & mv node_modules/rxjs node_modules/_rxjs
#mv node_modules _node_modules
#cd ${WORKSPACE}mycms-server-commons
#mv node_modules/@angular node_modules/_@angular & mv node_modules/rxjs node_modules/_rxjs
#mv node_modules _node_modules

echo "STEP: build frontend  -> there MUST NOT be the node_modules"
cd ${WORKSPACE}${MYCMSPROJECT}
npm run build-dev || exit
npm run frontendserver-build-dev-de || exit
