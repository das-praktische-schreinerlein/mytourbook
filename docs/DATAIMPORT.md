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
- copy orig from config and configure a ```backend.import.json``` and ```backend.json``` with another port and SqlMytbDb in ```overrides/after-build/config```
- configure ```src/frontend/environments/environment.ts``` to use this as backend-url 

## import tracks to import-database 

### do import
```bash
bash
cd sbin
./prepare-tracks-for-import-database.sh
./import-tracks-to-import-database.sh
```

### data-management: basics 
- [locations](http://localhost:4002/mytbdev/de/tdoc/search/jederzeit/ueberall/alles/egal/ungefiltert/relevance/location/10/1)
- [create trips](http://localhost:4002/mytbdev/de/tdocadmin/create/TRIP)

### data-management: tracks 
- [manage track: type/persons/GPS-tracks/date](http://localhost:4002/mytbdev/de/tdoc/search/jederzeit/ueberall/alles/egal/ungefiltert/relevance/track/10/1) 
  - HINT: use gpx-traclfiles from garmin archive-folder
- [generate and change tracknames](http://localhost:4002/mytbdev/de/tdoc/search/jederzeit/ueberall/alles/egal/ungefiltert/relevance/track/10/1)
- [manage rating/keywords](http://localhost:4002/mytbdev/de/tdoc/search/jederzeit/ueberall/alles/egal/ungefiltert/relevance/track/10/1)
- OPTIONAL - fix track-data if needed
  - connect to database (via gui or cli and run script manually)
  - [SQL mytbdb: fix trackdates in sqlite-database](installer/db/sqlite/mytbdb/fix-trackdates-by-imagedates.sql)
  - [SQL mytbdb: delete kategorie which are not used](installer/db/sqlite/mytbdb/delete-tracks-unused.sql)

### data-management: image-rating
- [select favorite images](http://localhost:4002/mytbdev/de/tdoc/search/jederzeit/ueberall/alles/egal/ungefiltert/relevance/track/10/1)
- [identify persons](http://localhost:4002/mytbdev/de/tdoc/search/jederzeit/ueberall/alles/egal/ungefiltert/relevance/track/10/1)
- [rate favorites](http://localhost:4002/mytbdev/de/sections/start/search/jederzeit/ueberall/alles/egal/personalRateOverall:5,6,7,8,9,10,11,12,13,14,15/dateAsc/image/99/1)
- [add additonal playlists for favorites](http://localhost:4002/mytbdev/de/sections/start/search/jederzeit/ueberall/alles/egal/personalRateOverall:5,6,7,8,9,10,11,12,13,14,15/dateAsc/image/99/1)
- [block private images from favorites](http://localhost:4002/mytbdev/de/sections/start/search/jederzeit/ueberall/alles/egal/personalRateOverall:5,6,7,8,9,10,11,12,13,14,15/dateAsc/image/99/1)

## import tracks from import-database to produrction-database 

### do import
```bash
./import-tracks-to-production-database.sh
./fix-data-in-production-database.sh
```

### data-management: touren/location
- [tracks: assing existing routes](http://localhost:4002/mytbdev/de/tdoc/search/jederzeit/ueberall/alles/egal/route_id_is:1/date/track/50/1)
- [manage location: sublocations of ImportXXX...](http://localhost:4002/mytbdev/de/tdoc/search/jederzeit/ueberall/alles/Import/egal/date/location/10/1)
- [create new routes](http://localhost:4002/mytbdev/de/tdoc/search/jederzeit/ueberall/alles/egal/route_id_is:1/ratePers/track/50/1)
- assign additional tracks to new routes
- [assign multi-route-tracks in legacy-system](http://localhost:8080/mediadb2/admin/Kategorie_TourEdit.do?CURTABLE=KATEGORIE&CURPAGE=popupshowkategorietouren&CURID=2316)
- [SQL mytbdb mysql: route set minDate](installer/db/mysql/mytbdb/update-tour-min-dates.sql)

## export to beta-solr
- import from mytbdb to mytbexportbetadb
```bash
mysql -u testmytbexportbetadb -p testmytbexportbetadb
use testmytbexportbetadb
source installer/db/mysql/mytbexportdb/import_01_create-model.sql;
source installer/db/mysql/mytbexportdb/import_02_import-data-from-mytbdb-to-mytbexportbetadb.sql;
exit;
```
- manually run sql-scripts to manipulate data
```bash
mysql -u testmytbexportbetadb -p testmytbexportbetadb
use testmytbexportbetadb
source installer/db/mysql/mytbexportdb/import_02_manage-common-data.sql;
source installer/db/mysql/mytbexportdb/import_02_manage-private-data.sql;
source installer/db/mysql/mytbexportdb/import_02_merge-person-object-fields.sql;
source installer/db/mysql/mytbexportdb/import_02_update-desc.sql;
exit;
```
- import from mytbexportbetadb to beta-solr
```bash
curl "http://localhost:8983/solr/coremytbbeta/dataimport?command=full-import&clean=true&commit=true&optimize=true&synchronous=true&verbose=true"
```

## export to prod-solr
- import from mytbexportbetadb to mytbexportproddb
```bash
mysql -u testmytbexportproddb -p testmytbexportproddb
use testmytbexportproddb
source installer/db/mysql/mytbexportdb/import_01_create-model.sql;
source installer/db/mysql/mytbexportdb/import_03_import-data-from-mytbexportbetadb-to-mytbexportproddb.sql;
```
- manually run sql-scripts to manipulate data
- import from mytbexportbetadb to beta-solr
```bash
curl "http://localhost:8983/solr/coremytbprod/dataimport?command=full-import&clean=true&commit=true&optimize=true&synchronous=true&verbose=true"
```
