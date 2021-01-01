# Data-Management

## initialize environment (once)

### create production database
- create mytbdb the master-database (mysql)
```bash
bash
mysql -u root -p 
source installer/db/mysql/mytbdb/init_01_create-database.sql
source installer/db/mysql/mytbdb/init_02_create-user.sql
```
- create mytbexportdb the export-database (mysql)
```bash
bash
mysql -u root -p 
source installer/db/mysql/mytbexportdb/init_01_create-database.sql
source installer/db/mysql/mytbexportdb/init_02_create-user.sql
``` 

### configure local environments
- copy orig from config and configure a ```backend.import.json``` and ```backend.dev.json``` with another port and SqlMytbDb in ```overrides/after-build/config```
- configure ```src/frontend/environments/environment.ts``` to use this as backend-url 

## import tracks to import-database
- do import
```bash
bash
cd sbin
./dataimport-01-prepare-tracks-for-import-database.sh IMPORTKEY
./dataimport-02-import-tracks-to-import-database.sh IMPORTKEY
```
## manage data in import-database
 
### data-management: basics 
- [dashboard](http://localhost:4001/mytbdev/de/#)
- [locations](http://localhost:4001/mytbdev/de/sections/start/search/jederzeit/ueberall/alles/egal/dashboardFilter:noSubType/forExport/location/10/1)
- [create trips](http://localhost:4001/mytbdev/de/tdocadmin/create/TRIP)
- [create news with timeframe over all tracks](http://localhost:4001/mytbdev/de/tdocadmin/create/NEWS)

### data-management: tracks 
- [manage track: type/persons/GPS-tracks/date,trackname](http://localhost:4001/mytbdev/de/sections/start/search/jederzeit/ueberall/alles/egal/dashboardFilter:noSubType/forExport/track/10/1) 
  - HINT: use gpx-trackfiles from garmin archive-folder
- [manage rating](http://localhost:4001/mytbdev/de/sections/start/search/jederzeit/ueberall/alles/egal/dashboardFilter:unrated/forExport/track/10/1)
- [manage keywords](http://localhost:4001/mytbdev/de/sections/start/search/jederzeit/ueberall/alles/egal/dashboardFilter:todoKeywords/forExport/track/10/1)
- OPTIONAL - fix track-data if needed
  - connect to database (via gui or cli and run script manually)
  - [SQL mytbdb: fix trackdates in sqlite-database](installer/db/sqlite/mytbdb/fix-trackdates-by-imagedates.sql)
  - [SQL mytbdb: delete kategorie which are not used](installer/db/sqlite/mytbdb/delete-tracks-unused.sql)

### data-management: image-rating
- [identify persons](http://localhost:4001/mytbdev/de/sections/start/search/jederzeit/ueberall/alles/egal/dashboardFilter:unRatedChildren/forExport/track/10/1)
- [select favorite images](http://localhost:4001/mytbdev/de/sections/start/search/jederzeit/ueberall/alles/egal/dashboardFilter:unRatedChildren/forExport/track/10/1)
- [add additional playlists for favorites](http://localhost:4001/mytbdev/de/sections/start/search/jederzeit/ueberall/alles/egal/dashboardFilter:noMainFavoriteChildren/forExport/track/10/1)
- [rate favorites](http://localhost:4001/mytbdev/de/sections/start/search/jederzeit/ueberall/alles/egal/dashboardFilter:noMainFavoriteChildren/forExport/track/10/1)
- [block private images from favorites](http://localhost:4001/mytbdev/de/sections/start/search/jederzeit/ueberall/alles/egal/personalRateOverall:5,6,7,8,9,10,11,12,13,14,15/dateAsc/image/99/1)

## import tracks from import-database to production-database 
- do import
```bash
./dataimport-03-import-tracks-to-production-database.sh IMPORTKEY
./dataimport-04-fix-data-in-production-database.sh
```

## manage data in production-database

### data-management: touren/location
- [tracks: assign existing routes](http://localhost:4001/mytbdev/de/sections/start/search/jederzeit/ueberall/alles/egal/dashboardFilter:noRoute/forExport/track/10/1)
- [manage location: sublocations of ImportXXX...](http://localhost:4001/mytbdev/de/tdoc/search/jederzeit/ueberall/alles/Import/egal/date/location/10/1)
- [create new routes](http://localhost:4001/mytbdev/de/sections/start/search/jederzeit/ueberall/alles/egal/dashboardFilter:noRoute/forExport/track/10/1)
- assign additional tracks to new routes

### OPTIONAL data-management: sync with external playlist-directories
- check playlist-directory with images against database
```
bash
cd sbin
./searchCorrespondingImages.sh f:/playground/mytb-test/testsearch/
``` 
- check playlist-directory with images against database with additional mapping-file from lire-search
```
bash
cd sbin
./searchCorrespondingImages.sh f:/playground/mytb-test/testsearch/ similars
``` 
-  open result-file in [MediaFileSync-Viewer](devtools/media-file-db-sync-viewer.html) check files and export playlist to import it as favorites andset playlist in database

## export to beta-solr
- import from mytbdb to mytbexportbetadb
```bash
npm run dbpublish-mytbexportbetadb_mysql
# or
npm run dbpublish-mytbexportbetadb_sqlite
```
- import from mytbexportbetadb to beta-solr
```bash
curl --user mytbadmin:SolrRocks "http://localhost:8983/solr/coremytbbeta/dataimport?command=full-import&clean=true&commit=true&optimize=true&synchronous=true&verbose=true"
```

## export to prod-solr
- import from mytbexportbetadb to mytbexportproddb
```bash
npm run dbpublish-mytbexportproddb_mysql
# or
npm run dbpublish-mytbexportproddb_sqlite
```
- import from mytbexportproddb to prod-solr
```bash
curl --user mytbadmin:SolrRocks "http://localhost:8983/solr/coremytbprod/dataimport?command=full-import&clean=true&commit=true&optimize=true&synchronous=true&verbose=true"
```
