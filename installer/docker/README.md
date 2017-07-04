

- start docker-machine
```
bash
dom_configure default
dom_init default
```
- create container
```
bash
cd /cygdrive/d/Projekte/mytourbook/installer/docker

./docker-prepare.sh

docker-compose down
docker-compose up -d --force-recreate --build

firefox http://192.168.99.100:8983/solr/#/mat/dataimport//dataimport
```
