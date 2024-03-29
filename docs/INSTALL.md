# Install MyTourBook

## prepare-dev

### prepare build-scripts
- build-dev.bash, build-beta.bash, build-prod.bash, build-viewer.bash
```bash
#!/usr/bin/env bash

WORKSPACE="/cygdrive/f/Projekte/"
MYCMSPROJECT="mytourbook"
```

### prepare src-directory
```bash
npm prune && npm install
``` 

### prepare ImageMagic

#### install-imagemagic
- configure package.json
```
  "config": {
   ...
    "imagemagicgoal": "install-imagemagic-doinstall",
    "imagemagicdownloadurl": "https://download.imagemagick.org/ImageMagick/download/binaries/ImageMagick-7.1.0-portable-Q16-HDRI-x86.zip",
  },

```
- run install script
```
npm install 
npm run install-imagemagic
```

##### OR do it manually install-imagemagic
- install ImageMagic 7 [Download a portable-version](https://imagemagick.org/script/download.php)
- A) configure path in backend.dev.json + backend.import.json
```
    "imageMagicAppPath": "F:\\ProgrammeShared\\ImageMagick\\",
```
- B) or use default-config and make a link
  - package.json
```
  "config": {
    ...
    "imagemagicgoal": "install-imagemagic-dosymlink",
    "imagemagicsharedpath": "F:/ProgrammeShared/ImageMagick/",
  },
```
  - backend.dev.json + backend.import.json
```
    "imageMagicAppPath": "conftrib/ImageMagick/",
```

### prepare solr

#### install-solr
- run install script
```
npm install 
npm run install-solr
```

##### OR do it manually install-solr
- install solr 6.6.0 [Download](http://mirror.netcologne.de/apache.org/lucene/solr/6.6.0/)
- add mysql-downloader
    - solr-6.6.0/contrib/dataimporthandler/lib/mysql-connector-java-5.1.40-bin.jar
    - solr-6.6.0/contrib/dataimporthandler/lib/sqlite-jdbc-3.31.1.jar
- add cores from mytb
- download [hunspell-language-files](https://github.com/elastic/hunspell/tree/master/dicts/de_DE) and put them as *lang/hunspell_de_DE.dic* and *lang/hunspell_de_DE.aff* into core-config
- download [grman dictionary](https://netix.dl.sourceforge.net/project/germandict/german.7z) and put as *lang/dictionary_de.txt* into core-config
- or use hunspell-dictionary
```bash
cp hunspell_de_DE.dic dictionary.txt
sed -i.bak s/\\/.*//g dictionary.txt
iconv -f "windows-1252" -t "UTF-8" dictionary.txt -o dictionary_de.txt
rm dictionary.txt dictionary.txt.bak
```

##### OR manually secure solr
- create an seen on [Enable Authentification](https://cwiki.apache.org/confluence/display/solr/Authentication+and+Authorization+Plugins#AuthenticationandAuthorizationPlugins-EnabledPluginswithsecurity.json)
    - file on server.solr/security.json
- with [Basic-Athentfication[https://cwiki.apache.org/confluence/display/solr/Basic+Authentication+Plugin]
    - solr-6.6.0/server/solr/security.json -> see mytourbook/installer/solr/security.json with default-password SolrRocks
```json
{
    "authentication": {
        "blockUnknown": true,
        "class": "solr.BasicAuthPlugin",
        "credentials": {
            "alladmin": "IV0EHq1OnNrj6gvRCwvFwTrZ1+z1oBbnQdiVC3otuq0= Ndd7LKvVBAaZIF0QAVi1ekCfAJXr1GGfLtRUXhgrF8c=",
            "mycmsadmin": "IV0EHq1OnNrj6gvRCwvFwTrZ1+z1oBbnQdiVC3otuq0= Ndd7LKvVBAaZIF0QAVi1ekCfAJXr1GGfLtRUXhgrF8c=",
            "mycmsupdate": "IV0EHq1OnNrj6gvRCwvFwTrZ1+z1oBbnQdiVC3otuq0= Ndd7LKvVBAaZIF0QAVi1ekCfAJXr1GGfLtRUXhgrF8c=",
            "mycmsread": "IV0EHq1OnNrj6gvRCwvFwTrZ1+z1oBbnQdiVC3otuq0= Ndd7LKvVBAaZIF0QAVi1ekCfAJXr1GGfLtRUXhgrF8c=",
            "mytbadmin": "IV0EHq1OnNrj6gvRCwvFwTrZ1+z1oBbnQdiVC3otuq0= Ndd7LKvVBAaZIF0QAVi1ekCfAJXr1GGfLtRUXhgrF8c=",
            "mytbupdate": "IV0EHq1OnNrj6gvRCwvFwTrZ1+z1oBbnQdiVC3otuq0= Ndd7LKvVBAaZIF0QAVi1ekCfAJXr1GGfLtRUXhgrF8c=",
            "mytbread": "IV0EHq1OnNrj6gvRCwvFwTrZ1+z1oBbnQdiVC3otuq0= Ndd7LKvVBAaZIF0QAVi1ekCfAJXr1GGfLtRUXhgrF8c="
        }
    },
    "authorization": {
        "class": "solr.RuleBasedAuthorizationPlugin",
        "permissions": [
            {
                "role": "role_dataimport",
                "path":"/dataimport",
                "collection": null,
                "method": ["GET", "POST"],
                "index": 1
            },
            {
                "role": "role_update",
                "name": "update",
                "index": 2
            },
            {
                "role": "role_read",
                "name": "read",
                "index": 2
            },
            {
                "role": "role_alladmin",
                "name": "all",
                "index": 3
            }
        ],
        "user-role": {
            "alladmin": [
                "role_alladmin"
            ],
            "mycmsadmin": [
                "role_read",
                "role_update",
                "role_dataimport"
            ],
            "mycmsupdate": [
                "role_read",
                "role_update"
            ],
            "mycmsread": "role_read",
            "mytbadmin": [
                "role_read",
                "role_update",
                "role_dataimport"
            ],
            "mytbread": "role_read"
        }
    }
}
```
- set roles as seen on (Rule-Based autorisation)[https://cwiki.apache.org/confluence/display/solr/Rule-Based+Authorization+Plugin]
- IMPORTANT if you use an external solr you must remove the solrPasswordReset on startup in the config/adminCli.PROFILE.json !!!!!
```
    {
        "parameters": {
            "command": "initConfig",
            "action": "resetSolrPasswords",
            "solrconfigbasepath": "dist/contrib/solr/server/solr"
        }
    }
```

### install redis
- make redis
```bash
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
make install
```
- dirs
```bash
mkdir /etc/redis/
mkdir /var/redis/
mkdir /var/redis/6379
```
- configure redis
```bash
cp redis.conf /etc/redis/6379.conf
vi /etc/redis/6379.conf

# accept only from localhost
bind 127.0.0.1
protected-mode yes

# set password-auth
requirepass blablum

# Set daemonize to yes (by default it is set to no).
daemonize yes

# Set the pidfile to /var/run/redis_6379.pid (modify the port if needed).
pidfile /var/run/redis_6379.pid

# Set your preferred loglevel.
loglevel notice

# Set the logfile to /var/log/redis_6379.log
logfile /var/log/redis_6379.log

# Set the dir to /var/redis/6379 (very important step!)
dir /var/redis/6379

# dont stop on write-errors
stop-writes-on-bgsave-error no
```
- startscript
```bash
cp utils/redis_init_script /etc/init.d/redis_6379
sudo update-rc.d redis_6379 defaults
```

## install liretools
```
git clone https://github.com/das-praktische-schreinerlein/liretools.git
cd liretools
gradle wrapper
gradlew initLireWin jar
```

## Build dev
Run for the dev-versions in `dist/`.
```bash
bash
./build-dev.bash
```

## Run scripts to initially reset database-passwords...
```bash
npm run backend-prepare-appenv-beforebuild
```

## Build beta
Run for the beta-versions in `dist/`.
```bash
bash
./build-beta.bash
```

## Build prod
Run for the prod-versions in `dist/`. 
```bash
bash
./build-prod.bash
```

## Build viewer
Run for the viewer-versions in `dist/`.
```bash
bash
./build-viewer.bash
```

## Deploy prod
Stop backend via startscript
```bash
/etc/init.d/mytb start
/etc/init.d/mytb-frontend start
```

Copy startscript `installer/linux/init.d/mytb*` to `/etc/init.d/` and change paths.

Copy files to server
```
package-dist.json
dist
config
error_docs
```

Copy files on server to `$APPDIR`
```bash
cd $APPDIR
rm -fr dist
mv $IMPORTDIR/dist $APPDIR

rm -fr config
mv $IMPORTDIR/config $APPDIR

rm -fr error_docs
mv $IMPORTDIR/error_docs $APPDIR

rm -fr package.json 
mv $IMPORTDIR/package-dist.json $APPDIR/package.json
```

Install packages
```bash
cd $APPDIR
npm install 
```

On first install - Run scripts to initially reset passwords per environment
```bash
npm run backend-prepare-appenv-afterinstall-dev
npm run backend-prepare-appenv-afterinstall-beta
npm run backend-prepare-appenv-afterinstall-prod
```

On update - Run scripts to reset passwords per environment
```bash
npm run backend-prepare-appenv-afterupdate-dev
npm run backend-prepare-appenv-afterupdate-beta
npm run backend-prepare-appenv-afterupdate-prod
```

Set permissions and rights für `$APPDIR`

Start backend via startscript
```bash
/etc/init.d/mytb start
/etc/init.d/mytb start-frontend
```

- clear redis-cache [seen on](https://stackoverflow.com/questions/4006324/how-to-atomically-delete-keys-matching-a-pattern-using-redis)
```
select 2
EVAL "local keys = redis.call('keys', ARGV[1]) \n for i=1,#keys,5000 do \n redis.call('del', unpack(keys, i, math.min(i+4999, #keys))) \n end \n return keys" 0 cache*
```
