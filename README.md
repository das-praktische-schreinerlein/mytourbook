# MyTourBook
This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.28.3.

## Prepare dev-environment

### prepare src-directory
- add symlinks
    - on windows in admin-console
```
cd src\frontend\ && mklink /D shared ..\shared && cd ..\backend\ && mklink /D shared ..\shared
```
- run `npm install`
- fix mytourbook/node_modules/@types/vis/index.d.ts
```
export class Graph3d {
  constructor(container: HTMLElement,
              items: any,
              options?: any);

  setCameraPosition(pos);
}
```

### prepare solr

#### install-solr
- install solr 6.6.0 [Download](http://mirror.netcologne.de/apache.org/lucene/solr/6.6.0/)
- add mysql-downloader
    - solr-6.6.0/contrib/dataimporthandler/libmysql-connector-java-5.1.40-bin.jar
- add core from mytb

#### secure solr
- create an seen on [Enable Authentification](https://cwiki.apache.org/confluence/display/solr/Authentication+and+Authorization+Plugins#AuthenticationandAuthorizationPlugins-EnabledPluginswithsecurity.json)
    - file on server.solr/security.json
- with [Basic-Athentfication[https://cwiki.apache.org/confluence/display/solr/Basic+Authentication+Plugin]
    - solr-6.6.0/server/solr/security.json
```
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
```
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
make install
```
- dirs
```
mkdir /etc/redis/
mkdir /var/redis/
mkdir /var/redis/6379
```
- configure redis
```
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
```
- startscipt
```
cp utils/redis_init_script /etc/init.d/redis_6379
sudo update-rc.d redis_6379 defaults
```

## Development server
Run `npm backend-build-serve` to build and start the backend. Navigate to `http://localhost:4100/api/v1/de/pdoc/` to get the pdocs.

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`.

## Running unit tests
Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests
Run `npm e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `npm start`.

## Build prod
Run `npm build-prod-de` or `npm build-prod-en` for the prod-versions in `dist/`. 

## Deploy prod
Stop backend via startscript
```
/etc/init.d/mytb start
```

Copy startscript `installer/linux/init.d/mytb` to `/etc/init.d/mytb` and change paths.

Copy files to server
```
package.json
dist
config
error_docs
```

Copy files on server to `$APPDIR`
```
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
```
cd $APPDIR
npm install 
```

Set permissions and rights für `$APPDIR`

Start backend via startscript
```
/etc/init.d/mytb start
```

- clear redis-cache [seen on](https://stackoverflow.com/questions/4006324/how-to-atomically-delete-keys-matching-a-pattern-using-redis)
```
select 2
EVAL "local keys = redis.call('keys', ARGV[1]) \n for i=1,#keys,5000 do \n redis.call('del', unpack(keys, i, math.min(i+4999, #keys))) \n end \n return keys" 0 cache*
```