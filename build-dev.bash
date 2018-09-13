#!/usr/bin/env bash

WORKSPACE="/cygdrive/d/Projekte/"
MYCMSPROJECT="mytourbook_upgrade"

echo "STEP: build commons"
cd ${WORKSPACE}mycms-commons
mv _node_modules node_modules & mv node_modules/_@angular node_modules/@angular & mv node_modules/_rxjs node_modules/rxjs
#npm prune || exit
#npm install || exit
#npm run build || exit
#npm link || exit

echo "STEP: build frontend-commons"
cd ${WORKSPACE}mycms-frontend-commons
mv _node_modules node_modules & mv node_modules/_@angular node_modules/@angular & mv node_modules/_rxjs node_modules/rxjs
##npm unlink @dps/mycms-commons || exit
#npm prune || exit
#npm install || exit
#npm link @dps/mycms-commons || exit
#npm run build || exit
#npm link || exit

echo "STEP: build server-commons"
cd ${WORKSPACE}mycms-server-commons
mv _node_modules node_modules & mv node_modules/_@angular node_modules/@angular & mv node_modules/_rxjs node_modules/rxjs
##npm unlink @dps/mycms-commons || exit
#npm prune || exit
#npm install || exit
#npm link @dps/mycms-commons || exit
#npm run build || exit
#npm link || exit

echo "STEP: copy additional src and clear not used ts"
cd ${WORKSPACE}mycms-frontend-commons \
    && cd src \
    && /usr/bin/find ./ -name \*.ts -type f -exec  cp --parents {} ../dist/ \; \
    && /usr/bin/find ./ -name \*.html -type f -exec  cp --parents {} ../dist/ \; \
    && /usr/bin/find ./ -name \*.css -type f -exec  cp --parents {} ../dist/ \; \
    && cd .. \
    && /usr/bin/find dist/testing/ -regextype posix-extended -iregex '.*[a-z]{2}.ts' -type f -exec  rm {} \; \
    && /usr/bin/find dist/angular-commons/testing/ -regextype posix-extended -iregex '.*[a-z]{2}.ts' -type f -exec  rm {} \; \
    && /usr/bin/find dist -regextype posix-extended -iregex '.*cdoc-routing.service.ts' -type f -exec  rm {} \; \
    && /usr/bin/find dist -regextype posix-extended -iregex '.*common-routing.service.ts' -type f -exec  rm {} \; \
    || exit

##echo "STEP: unlink commons"
##cd ${WORKSPACE}${MYCMSPROJECT}
##npm unlink @dps/mycms-commons || exit
##npm unlink @dps/mycms-frontend-commons || exit
##npm unlink @dps/mycms-server-commons || exit

echo "STEP: install node_modules"
cd ${WORKSPACE}${MYCMSPROJECT}
#npm prune || exit
npm install || exit
#npm link @dps/mycms-commons || exit
#npm link @dps/mycms-frontend-commons || exit
#npm link @dps/mycms-server-commons || exit

echo "STEP: build server  -> they need the node_modules"
cd ${WORKSPACE}${MYCMSPROJECT}
npm run backend-build || exit
npm run frontendserver-build-server-dev-de || exit
npm run frontendserver-build-admin-dev-de || exit

echo "STEP: backup redundant node_modules"
cd ${WORKSPACE}mycms-commons
#mv node_modules/@angular node_modules/_@angular & mv node_modules/rxjs node_modules/_rxjs
#mv node_modules _node_modules
cd ${WORKSPACE}mycms-frontend-commons
#mv node_modules/@angular node_modules/_@angular & mv node_modules/rxjs node_modules/_rxjs
#mv node_modules _node_modules
cd ${WORKSPACE}mycms-server-commons
#mv node_modules/@angular node_modules/_@angular & mv node_modules/rxjs node_modules/_rxjs
#mv node_modules _node_modules

echo "STEP: build frontend  -> there MUST NOT be the node_modules"
cd ${WORKSPACE}${MYCMSPROJECT}
npm run prepare-dev || exit
npm run frontendserver-build-dev-de || exit

#echo "STEP: start backend"
#cd ${WORKSPACE}${MYCMSPROJECT} \
#   && npm run backend-serve

#echo "STEP: start server"
#cd ${WORKSPACE}${MYCMSPROJECT} \
#   && npm run frontendserver-serve-dev-de

#echo "STEP: serve static"
#cd ${WORKSPACE}${MYCMSPROJECT} \
#   && npm run static-serve
