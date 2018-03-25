# Configure MyTourBook

## Backend

### API-Server Config: config/backend.json
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
    "sdocWritable": false
}
```
- datastore and specific connection-attributes 
```json
{
    "sdocDataStoreAdapter": "SDocSolrAdapter",
    "SDocSqlMediadbAdapter": {
        "client": "mysql",
        "connection": {
            "host": "localhost",
            "user": "mytbuser",
            "password": "blablum",
            "database": "testmediadb",
            "port": "3306",
            "filename": "D:/Bilder/mytbbase/test/mediadb.sqlite"
        }
    },
    "SDocSqlMytbAdapter": {
        "client": "mysql",
        "connection": {
            "host": "localhost",
            "user": "mytbuser",
            "password": "blablum",
            "database": "mytb",
            "port": "3306",
            "filename": "D:/Bilder/mytbbase/test/mytb.sqlite"
        }
    },
    "SDocSolrAdapter": {
        "solrCoreSDoc": "http://localhost:8983/solr/mytbdev/",
        "solrCoreSDocReadUsername": "mytbread",
        "solrCoreSDocReadPassword": "SolrRocks"
    }
}
```
- pathes to images and tracks
```json
{
    "apiRouteTracksStaticDir": "D:/webs/www.michas-ausflugstipps.de/dataDB/tracks/",
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

### Frontendserver: config/frontend.json
The configuration for the frontendserver.

- configure port and cachefolder
```json
{
    "port": 4002,
    "cacheFolder": "cache/"
} 
```

### Backend-Firewall: config/firewall.json
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
    sdocWritable: true,
    sdocActionTagWritable: true
};
```
- album-config
```typescript
export const environment = {
    allowAutoPlay: true,
    sdocMaxItemsPerAlbum: 20000
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
        "sdoc-keywords": {
            "editPrefix": "KW_",
            "possiblePrefixes": ["KW_", "", "kw_"],
            "structuredKeywords": [
                {"name": "Aktivität", "keywords": ["Alpinklettern", "Baden", "Boofen", "Bootfahren", "Campen",
                    "Fliegen", "Gletscherbegehung", "Kanu", "Klettern", "Klettersteig",
                    "Radfahren", "Schneeschuhwandern", "Skaten", "Wandern", "Museumsbesuch", "Sachsenklettern",
                    "Sportklettern", "Stadtbesichtigung", "Besichtigung", "Gassi", "Hochtour", "Spaziergang",
                    "Wanderung"]},
                {"name": "Kultur", "keywords": ["Denkmal", "Geschichte", "Kunst", "Museum",
                    "Architektur", "Burg", "Dom", "Kirche", "Park", "Schloss", "Zoo"]},
            ],
            "keywordSuggestions": [
            ],
            "blacklist": ["OFFEN", "Mom", "Pa", "Micha"]
        },
        "sdoc-persontags": {
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
        "sdoc-actions": {
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
                            "property": "permissions.sdocWritable",
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
        "sdoc-albumpage": {
            "allowAutoplay": false
        },
        "sdoc-listheader": {
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
            "sdocIndexableTypes": ["ROUTE", "LOCATION", "NEWS"]
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
    "meta.title.prefix.sdocSearchPage": "MyTourBook - Suche",
    "meta.title.prefix.sdocShowPage": "MyTourBook - {{sdoc}}",
    "meta.title.prefix.sdocSectionSearchPage": "MyTourBook - {{title}} - Suche",
    "meta.title.prefix.sdocSectionShowPage": "MyTourBook - {{title}} - {{sdoc}}",
    "meta.desc.prefix.errorPage": "MyTourBook - Oje ein Fehler ist aufgetreten",
    "meta.desc.prefix.sectionPage": "MyTourBook - {{title}} - {{teaser}}",
    "meta.desc.prefix.sdocSearchPage": "MyTourBook - Touren/Berichte/Regionen/Bilder/Infos",
    "meta.desc.prefix.sdocShowPage": "MyTourBook - Infos für {{sdoc}}",
    "meta.desc.prefix.sdocSectionSearchPage": "MyTourBook - Touren/Berichte/Regionen/Bilder/Infos zum Thema {{title}} - {{teaser}}",
    "meta.desc.prefix.sdocSectionShowPage": "MyTourBook - {{title}} - Infos für {{sdoc}}",
```