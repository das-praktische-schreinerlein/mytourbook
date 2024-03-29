# Configure MyTourBook

- if you want to get save override the configuration-file in overrides-directory.

## Backend

### environment
- configure windows vars in sbin/configure-environment.cmd
```bash
set DIGIFOTOS_BASEDIR=F:\playground\mytb-test\Bilder\digifotos\
set VIDEOS_BASEDIR=F:\playground\mytb-test\Bilder\Videos\
set MYTB_IMPORT_MEDIADIR=F:\playground\mytb-test\mytbbase\
set MYTB_MEDIADIR=F:\playground\mytb-test\mytbmediabase\
set MYTB_INDEXDIR=F:\playground\mytb-test\mytbindex\
set MYTB_INDEXSRC_MEDIADIR=%MYTB_MEDIADIR%pics_x100\
set MYTBTOOLS=F:\Projekte\mytourbook_dev\sbin\
set MYTB=F:\Projekte\mytourbook_dev\
set LIRETOOLS=F:\Projekte\liretools\
```   
- configure unix vars in sbin/configure-environment.bash
```bash
DIGIFOTOS_BASEDIR=/cygdrive/f/playground/mytb-test/Bilder/digifotos/
VIDEOS_BASEDIR=/cygdrive/f/playground/mytb-test/Bilder/Videos/
MYTB_IMPORT_MEDIADIR=/cygdrive/f/playground/mytb-test/mytbbase/
MYTB_MEDIADIR=/cygdrive/f/playground/mytb-test/mytbmediabase/
MYTB_INDEXDIR=/cygdrive/f/playground/mytb-test/mytbindex/
MYTB_INDEXSRC_MEDIADIR=${MYTB_MEDIADIR}pics_x100/
MYTBTOOLS=/cygdrive/f/Projekte/mytourbook_dev/sbin/
MYTB=/cygdrive/f/Projekte/mytourbook_dev/
LIRETOOLS=/cygdrive/f/Projekte/liretools/
W_DIGIFOTOS_BASEDIR="F:\\playground\\mytb-test\\Bilder\\digifotos\\"
W_VIDEOS_BASEDIR="F:\\playground\\mytb-test\\Bilder\\Videos\\"
W_MYTB_IMPORT_MEDIADIR="F:\\playground\\mytb-test\\mytbbase\\"
W_MYTB_MEDIADIR="F:\\playground\\mytb-test\\mytbmediabase\\"
W_MYTB_INDEXDIR="F:\\playground\\mytb-test\\mytbindex\\"
W_MYTB_INDEXSRC_MEDIADIR="${W_MYTB_MEDIADIR}pics_x100\\"
W_MYTBTOOLS="F:\\Projekte\\mytourbook_dev\\sbin\\"
W_MYTB="F:\\Projekte\\mytourbook_dev\\"
W_LIREOOLS="F:\\Projekte\\liretools\\"
```

### API-Server Config: config/backend.PROFILE.json
The configuration-file to configure the backend-api-server.

- server-port for backend-api
```json
{
    "port": 4100
}
```
- writable or readonly
```json
{
    "tdocWritable": false
}
```
- datastore and specific connection-attributes 
```json
{
    "tdocDataStoreAdapter": "TourDocSolrAdapter",
    "TourDocSqlMytbDbAdapter": {
        "client": "mysql",
        "connection": {
            "host": "localhost",
            "user": "mytbuser",
            "password": "blablum",
            "database": "testmytbdb",
            "port": "3306",
            "filename": "D:/Bilder/mytbbase/test/mytbdb.sqlite"
        },
        "facetCacheUsage": {
            "active": true,
            "entities": {
                "odimgobject": {
                    "facetKeyPatterns": [".*"]
                },
                "image": {
                    "facetKeyPatterns": [".*"]
                }
            }
        },
        "facetCacheConfig": {
            "datastore": {
                "scriptPath": "installer/db/mysql/facetcache"
            },
            "facets": [
            ],
            "checkInterval": 2
        }
    },
    "TourDocSqlMytbExportDbAdapter": {
        "client": "mysql",
        "connection": {
            "host": "localhost",
            "user": "mytbuser",
            "password": "blablum",
            "database": "mytbexportdb",
            "port": "3306",
            "filename": "D:/Bilder/mytbbase/test/mytbexportdb.sqlite"
        }
    },
    "TourDocSolrAdapter": {
        "solrCoreTourDoc": "http://localhost:8983/solr/mytbdev/",
        "solrCoreTourDocReadUsername": "mytbread",
        "solrCoreTourDocReadPassword": "SolrRocks"
    }
}
```
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
- pathes to images and tracks
```json
{
    "apiRouteTracksStaticDir": "F:/webs/www.michas-ausflugstipps.de/dataDB/tracks/",
    "apiRoutePicturesStaticDir": "D:/Bilder/www.michas-ausflugstipps.de/"
}
```
- specific filters for allowed keywords
```json
{
    "mapperConfig": {
        "allowedKeywordPatterns": ["KW_.*", "Harry", "Booga", "Buddy", "Micha"],
        "replaceKeywordPatterns": []
    }
}
```
- if you want to allow playlists
```json
{
    "playlistExportAudioBaseUrl": "http://localhost:4100/api/static/audios/",
    "playlistExportImageBaseUrl": "http://localhost:4100/api/static/picturestore/",
    "playlistExportVideoBaseUrl": "http://localhost:4100/api/static/videos/",
    "playlistExportUseAudioAssetStoreUrls": false,
    "playlistExportUseImageAssetStoreUrls": true,
    "playlistExportUseVideoAssetStoreUrls": false,
    "playlistExportMaxM3uRecordAllowed": 1000
}
```
- if you use a rediscache
```json
{
    "cacheConfig": {
        "cacheRedisUrl": "redis://localhost:6379/",
        "cacheRedisPass": "blablub",
        "cacheRedisDB": "2"
    }
}    
```
- if you use object-detection
```json
{
    "objectDetectionConfig": {
        "redisQueue": {
            "host": "localhost",
            "port": "6379",
            "pass": "blablub",
            "db": "",
            "ns": "rsmq",
            "requestQueue": "mycms-objectdetector-request",
            "responseQueue": "mycms-objectdetector-response",
            "errorQueue": "mycms-objectdetector-error"
        },
        "availableDetectors": [
            "tfjs_cocossd_mobilenet_v1",
            "tfjs_cocossd_mobilenet_v2",
            "tfjs_cocossd_lite_mobilenet_v2",
            "tfjs_mobilenet_v1",
            "tfjs_posenet",
            "faceapi",
            "picasafile"
        ],
        "defaultDetectors": [
            "tfjs_cocossd_mobilenet_v1",
            "tfjs_cocossd_mobilenet_v2",
            "tfjs_cocossd_lite_mobilenet_v2",
            "tfjs_mobilenet_v1",
            "faceapi",
            "picasafile"
        ]
    }
}
```

### Frontendserver: config/frontend.PROFILE.json
The configuration for the frontendserver.

- configure port and cachefolder
```json
{
    "port": 4002,
    "cacheFolder": "cache/"
} 
```

### Backend-Firewall: config/firewall.PROFILE.json
The configuration-file to configure the firewall for backend-api-server and frontend-server.

- if you habe a dns-blacklist-account
```json
{
    "dnsBLConfig": {
        "apiKey": "",
        "maxThreatScore": 20,
        "dnsttl": 3600000,
        "errttl": 60000,
        "timeout": 3000,
        "whitelistIps": ["::1", "127.0.0.1"],
        "cacheRedisUrl": "redis://localhost:6379/",
        "cacheRedisPass": "blablub",
        "cacheRedisDB": "1"
    }
}
```
- static blacklist to block spanner/spider...
```json
{
    "blackListIps": [
    ]
}
```

### API-Server Content: config/pdocs-de.json
Configure the content of the static section-pages.

- page-content
```json
{
 "pdocs": [
  {
   "id": "start",
   "descMd": "Willkommen bei MyTB dem Portal für die Tourenplanung in ausgewählten Ländern der Welt. Es ist eine Mischung aus [Tourenführer (Tourentipps)](sections/start/search/jederzeit/ueberall/alles/egal/ungefiltert/relevance/route/5/1), Reise-Wiki (Regionen), bebildertem Tagebuch (Berichte), Bildersuche (Bilder) angelehnt an [Michas-Ausflugstipps](http://www.michas-ausflugstipps.de/).",
   "flgShowTopTen": true,
   "flgShowNews": true,
   "flgShowSearch": true,
   "heading": "Thats MyTB",
   "name": "Start",
   "subSectionIds": "schwerpunkt",
   "teaser": "Willkommen bei MyTB",
   "type": "SectionOverviewPage"
  }
  ]
}
```

### API-Server themefilter: config/themeFilterConfig.json
Configure the mapping of the section-page-ids to specifiv filters a "berge -> KW_Berge".

- mapping
```json
{ 
   "berge": { "keywords_txt": { "in": ["kw_berge"] } },
   "museum": { "keywords_txt": { "in": ["kw_museum", "kw_museumsbesuch"] } },
   "klettern": { "keywords_txt": { "in": ["kw_klettern", "kw_sachsenklettern", "kw_sportklettern", "kw_alpinklettern"] } }
}
```

### Admin-API-Server Config: config/adminServer.PROFILE.json
- port
```
    "port": 4900,
```
- the flag that admin is available and the available predefined admin-commands to execute via web
```
    "commandConfig": {
        "adminWritable": true,
        "preparedCommands": {
            "importMedia": {
                "description": "import media from media-directory",
                "commands": [
                    {
                        "parameters": {
                            "command": "mediaManager",
                            "action": "generateTourDocsFromMediaDir",
                            "backend": "config/backend.dev.json",
                            "importDir": "F:\\playground\\mytb-test\\mytbmediabase\\pics_full\\",
                            "outputFile": "F:\\playground\\mytb-test\\mytbmediabase\\pics_full\\mytbdb_import-import-images.json",
                            "renameFileIfExists": "true"
                        }
                    },
                ]
            }
        }
    }
```

### CLI Config: config/adminCli.PROFILE.json
- the flag that admin is available and the available admin-commands to execute via cli
```
    "adminWritable": true,
    "availableCommands": {
        "*": "*"
    },
    "preparedCommands": {
        "prepareAppEnv": {
            "description": "prepare app-environment (do database-migrations...)",
            "commands": [
                {
                    "description": "do db-migration",
                    "parameters": {
                        "command": "dbMigrate",
                        "action": "migrateDB",
                        "migrationDbConfigFile": "config/db-migrate-database.json",
                        "migrationsDir": "migrations/mytbdb",
                        "migrationEnv": "mytbdb_mysql"
                    }

                }
            ]
        }
    },
    "constantParameters": {
        "noOverrides": "use all parameters as put to commandline"
    }
```
- **IMPORTANT if you DON'T want to reset passwords -> remove such actions from config/adminCli.PROFILE.json !!!!!**
```
    {
        "parameters": {
            "command": "initConfig",
            "action": "resetSolrPasswords",
            "solrconfigbasepath": "dist/contrib/solr/server/solr"
        }
    }
```
- **IMPORTANT if you use an external solr you must remove the solrPasswordReset on startup in the config/adminCli.PROFILE.json !!!!!**
```
    {
        "parameters": {
            "command": "initConfig",
            "action": "resetSolrPasswords",
            "solrconfigbasepath": "dist/contrib/solr/server/solr"
        }
    }
```

## Frontend

### Build-Environment: src/frontend/environments/environment.*.ts

- connection-urls of the backend-api
```typescript
export const environment = {
    backendApiBaseUrl: 'http://localhost:4100/api/v1/',
    tracksBaseUrl: 'http://localhost:4100/api/assets/trackstore/',
    picsBaseUrl: 'http://localhost:4100/api/static/picturestore/'
};
```
- production and writable-flags
```typescript
export const environment = {
    production: false,
    tdocWritable: true,
    tdocActionTagWritable: true
};
```
- album-config
```typescript
export const environment = {
    allowAutoPlay: true,
    tdocMaxItemsPerAlbum: 20000
};
```
- tracking-provider
```typescript
export const environment = {
    trackingProviders: [Angulartics2Piwik]
};
```

### App-Config: src/frontend/assets/config.json

- keyword/person-structure
```json
{
    "components": {
        "tdoc-keywords": {
            "editPrefix": "KW_",
            "possiblePrefixes": ["KW_", "", "kw_"],
            "structuredKeywords": [
                {"name": "Aktivität", "keywords": ["Alpinklettern", "Baden", "Boofen", "Bootfahren", "Campen",
                    "Fliegen", "Gletscherbegehung", "Kanu", "Klettern", "Klettersteig",
                    "Radfahren", "Schneeschuhwandern", "Skaten", "Wandern", "Museumsbesuch", "Sachsenklettern",
                    "Sportklettern", "Stadtbesichtigung", "Besichtigung", "Gassi", "Hochtour", "Spaziergang",
                    "Wanderung", "Wildwasserschwimmen"]},
                {"name": "Kultur", "keywords": ["Denkmal", "Geschichte", "Kunst", "Museum",
                    "Architektur", "Burg", "Dom", "Kirche", "Park", "Schloss", "Zoo"]},
            ],
            "keywordSuggestions": [
            ],
            "blacklist": ["OFFEN", "Mom", "Pa", "Micha"]
        },
        "tdoc-persontags": {
            "editPrefix": "",
            "possiblePrefixes": ["KW_", "", "kw_", "Pers_"],
            "structuredKeywords": [
                {"name": "mit Freunden", "keywords": ["Freund1", "Freund2"]},
                {"name": "mit Familie", "keywords": ["Micha", "Ich", "Frau", "Mann"]},
                {"name": "mit Hundis", "keywords": ["Harry", "Buddy"]}
            ],
            "keywordSuggestions": [
                {   "name": "Personen Klettern", "keywords": ["Freund1"],
                    "filters": [{ "property": "subtype", "command": "CSVIN", "expectedValues": ["128"]}]
                },
                {   "name": "Hunde Gassi", "keywords": ["Buddy"],
                    "filters": [{ "property": "subtype", "command": "CSVIN", "expectedValues": ["111"]}]
                }
            ],
            "blacklist": []
        }
    }
}
```
- configure available actions to show per item
```json
{
    "components": {
        "tdoc-actions": {
            "actionTags": [
                {
                    "key": "edit",
                    "type": "edit",
                    "name": "Edit",
                    "shortName": "&#x1f589",
                    "showFilter": [
                        {
                            "property": "dummy",
                            "command": "EQ",
                            "expectedValues": ["dummy"]
                        }
                    ],
                    "recordAvailability": [
                        {
                            "property": "type",
                            "command": "CSVIN",
                            "expectedValues": ["LOCATION", "location", "TRACK", "track", "ROUTE", "route", "TRIP", "trip", "NEWS", "news"]
                        }
                    ],
                    "configAvailability": [
                        {
                            "property": "permissions.tdocWritable",
                            "command": "EQ",
                            "expectedValues": [true]
                        }
                    ]
                }
            ]
        }
    }
}
```
- autoplay of album or resultlist allowed for presentations
```json
{
    "components": {
        "tdoc-albumpage": {
            "allowAutoplay": false
        },
        "cdoc-listheader": {
            "allowAutoplay": false
        }
    }
}
```
- configure seo
```json
{
    "services": {
        "seo": {
            "tdocIndexableTypes": ["ROUTE", "LOCATION", "NEWS"]
        }
    }
}
```

### Override some message-resources: src/frontend/assets/locales/locale-de-overrides.json 

- brandname and descriptions
```json
{
    "nav.brand.appName": "MyTourBook",
    "meta.title.prefix.errorPage": "MyTourBook - Oje ein Fehler",
    "meta.title.prefix.sectionPage": "MyTourBook - {{title}}",
    "meta.title.prefix.cdocSearchPage": "MyTourBook - Suche",
    "meta.title.prefix.cdocShowPage": "MyTourBook - {{cdoc}}",
    "meta.title.prefix.cdocSectionSearchPage": "MyTourBook - {{title}} - Suche",
    "meta.title.prefix.cdocSectionShowPage": "MyTourBook - {{title}} - {{cdoc}}",
    "meta.desc.prefix.errorPage": "MyTourBook - Oje ein Fehler ist aufgetreten",
    "meta.desc.prefix.sectionPage": "MyTourBook - {{title}} - {{teaser}}",
    "meta.desc.prefix.cdocSearchPage": "MyTourBook - Touren/Berichte/Regionen/Bilder/Infos",
    "meta.desc.prefix.cdocShowPage": "MyTourBook - Infos für {{cdoc}}",
    "meta.desc.prefix.cdocSectionSearchPage": "MyTourBook - Touren/Berichte/Regionen/Bilder/Infos zum Thema {{title}} - {{teaser}}",
    "meta.desc.prefix.cdocSectionShowPage": "MyTourBook - {{title}} - Infos für {{cdoc}}",
```
