# Install MyTourBook

## prepare-dev

### prepare src-directory
```bash
npm prune && npm install
``` 

### prepare solr

#### install-solr
- install solr 6.6.0 [Download](http://mirror.netcologne.de/apache.org/lucene/solr/6.6.0/)
- add mysql-downloader
    - solr-6.6.0/contrib/dataimporthandler/libmysql-connector-java-5.1.40-bin.jar
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

#### secure solr
- create an seen on [Enable Authentification](https://cwiki.apache.org/confluence/display/solr/Authentication+and+Authorization+Plugins#AuthenticationandAuthorizationPlugins-EnabledPluginswithsecurity.json)
    - file on server.solr/security.json
- with [Basic-Athentfication[https://cwiki.apache.org/confluence/display/solr/Basic+Authentication+Plugin]
    - solr-6.6.0/server/solr/security.json
```json
{
  "authentication":{
    "blockUnknown":true,
    "class":"solr.BasicAuthPlugin",
    "credentials":{
      "alladmin":"XXXXX",
      "mytbadmin":"XXXXX",
      "mytbread":"XXXXX"}},
  "authorization":{
    "class":"solr.RuleBasedAuthorizationPlugin",
    "permissions":[
      {
        "name":"all",
        "role":"role_alladmin",
        "index":1},
      {
        "name":"update",
        "role":"role_mytbupdate",
        "index":2},
      {
        "name":"read",
        "role":"role_mytbread",
        "index":2}
    ],
    "user-role":{
      "alladmin":["role_alladmin"],
      "mytbadmin":["role_mytbread", "role_mytbupdate"],
      "mytbread":"role_mytbread"},
    "":{"v":0}}}
```
- set roles as seen on (Rule-Based autorisation)[https://cwiki.apache.org/confluence/display/solr/Rule-Based+Authorization+Plugin]

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
gradlew initLireWin jar
```

## Build dev
Run for the dev-versions in `dist/`.
```bash
bash
./build-dev.bash
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

## Deploy prod
Stop backend via startscript
```bash
/etc/init.d/mytb start
/etc/init.d/mytb-frontend start
```

Copy startscript `installer/linux/init.d/mytb*` to `/etc/init.d/` and change paths.

Copy files to server
```
package.json
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
mv $IMPORTDIR/package.json $APPDIR
```

Install packages
```bash
cd $APPDIR
npm install 
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
