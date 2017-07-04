FROM solr:6.2.1

# extend: https://github.com/docker-solr/docker-solr/blob/b7960dec349778ffbf23c5042b7bb7f6f26ced79/6.2/Dockerfile

USER root
RUN apt-get update \
      && apt-get install -y sudo curl \
      && rm -rf /var/lib/apt/lists/* \
      && apt-get autoclean

# Download MYSQL Driver
ENV MYSQL_DRIVER_VERSION 5.1.38
RUN curl -Lks http://dev.mysql.com/get/Downloads/Connector-J/mysql-connector-java-${MYSQL_DRIVER_VERSION}.tar.gz -o /tmp/mysql-connector.tar.gz
RUN tar xzf /tmp/mysql-connector.tar.gz --strip=1 --wildcards '*/mysql-connector-java*.jar' && \
    mkdir -p /opt/solr/contrib/dataimporthandler/lib && \
    mv mysql-connector-java*.jar /opt/solr/contrib/dataimporthandler/lib/ && \
    rm /tmp/mysql-connector.tar.gz

# prepare core
USER $SOLR_USER
RUN mkdir -p /opt/solr/server/solr/mytb \
    /opt/solr/server/solr/mytb/data/\
    /opt/solr/server/solr/mytb/data/snapshot_metadata\
    /opt/solr/server/solr/mytb/data/index
COPY cores/coremytb /opt/solr/server/solr/mytb

EXPOSE 8983
WORKDIR /opt/solr

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["solr-foreground"]
