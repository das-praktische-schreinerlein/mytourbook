#!/bin/bash
##########################
# prepare docker-images
##########################

DOCKER_DIR=$(dirname $(readlink -f $0))/
INSTALL_BASE_DIR=${DOCKER_DIR}/../

# copy mysql-db
rm -fr ${DOCKER_DIR}/mysqldb/docker-entrypoint-initdb.d
mkdir ${DOCKER_DIR}/mysqldb/docker-entrypoint-initdb.d
cp -ra ${INSTALL_BASE_DIR}/mysql/db ${DOCKER_DIR}/mysqldb/docker-entrypoint-initdb.d/

# copy solr-core
rm -fr ${DOCKER_DIR}/solr/cores
mkdir -p ${DOCKER_DIR}/solr/cores/coremytb
cp -ra ${INSTALL_BASE_DIR}/solr/coremytb ${DOCKER_DIR}/solr/cores/

