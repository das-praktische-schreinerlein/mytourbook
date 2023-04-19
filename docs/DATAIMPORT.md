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
- prepare
```bash
bash
cd sbin
./prepare-environment.sh IMPORTKEY
```
- start import-app
```cmd
cd sbin
start-app.bat import
```
- [run import-scripts in admin-area](http://localhost:4001/mytbdev/de/#)

## manage data in import-database
 
### data-management: basics 
- check todos [dashboard](http://localhost:4001/mytbdev/de/#)
- [locations](http://localhost:4001/mytbdev/de/sections/start/search/jederzeit/ueberall/alles/egal/dashboardFilter:noSubType/forExport/location/10/1)
- [create trips](http://localhost:4001/mytbdev/de/tdocadmin/create/TRIP)
- [create news with timeframe over all tracks](http://localhost:4001/mytbdev/de/tdocadmin/create/NEWS)

### data-management: tracks 
- [manage track: type/persons/GPS-tracks/date,trackname](http://localhost:4001/mytbdev/de/sections/start/search/jederzeit/ueberall/alles/egal/dashboardFilter:noSubType/forExport/track/10/1) 
  - HINT: use gpx-trackfiles from garmin archive-folder
- [manage track rating](http://localhost:4001/mytbdev/de/sections/start/search/jederzeit/ueberall/alles/egal/dashboardFilter:unrated/forExport/track/10/1)
- [manage keywords](http://localhost:4001/mytbdev/de/sections/start/search/jederzeit/ueberall/alles/egal/dashboardFilter:todoKeywords/forExport/track/10/1)
- OPTIONAL - fix track-data if needed
  - connect to database (via gui or cli and run script manually)
  - [SQL mytbdb: fix trackdates in sqlite-database](installer/db/sqlite/mytbdb/fix-trackdates-by-imagedates.sql)

## import tracks from import-database to production-database 
- start import-app
```cmd
cd sbin
start-app.bat import
```
- [run export-scripts in admin-area](http://localhost:4001/mytbdev/de/#)
- stop import-app
- start dev-app
```cmd
cd sbin
start-app.bat dev
```
- [run import-scripts in admin-area](http://localhost:4001/mytbdev/de/#)
- fix data
```bash
./dataimport-04-fix-data-in-production-database.sh
```

## manage data in production-database

### data-management: image-rating 2.
- [select favorite images](http://localhost:4001/mytbdev/de/sections/start/search/jederzeit/ueberall/alles/egal/dashboardFilter:unrated/trackDateAsc/image/99/1)
- [identify persons](http://localhost:4001/mytbdev/de/sections/start/search/jederzeit/ueberall/alles/egal/personalRateOverall:1,2,3,4,5,6,7,8,9,10,11,12,13,14,15/trackDateAsc/image/99/1) 
- [rate favorites](http://localhost:4001/mytbdev/de/sections/start/search/jederzeit/ueberall/alles/egal/personalRateOverall:5,6,7,8,9,10,11,12,13,14,15/trackDateAsc/image/99/1)
- [add additonal playlists for favorites](http://localhost:4001/mytbdev/de/sections/start/search/jederzeit/ueberall/alles/egal/personalRateOverall:5,6,7,8,9,10,11,12,13,14,15/trackDateAsc/image/99/1)
- [block private images from favorites](http://localhost:4001/mytbdev/de/sections/start/search/jederzeit/ueberall/alles/egal/personalRateOverall:5,6,7,8,9,10,11,12,13,14,15/trackDateAsc/image/99/1)

### data-management: touren/location
- [tracks: assign existing routes](http://localhost:4001/mytbdev/de/sections/start/search/jederzeit/ueberall/alles/egal/dashboardFilter:noRoute/forExport/track/10/1)
- [manage location: sublocations of Import](http://localhost:4001/mytbdev/de/sections/start/search/jederzeit/ueberall/alles/egal/dashboardFilter:noLocation/forExport/location/10/1)
- [create new routes](http://localhost:4001/mytbdev/de/sections/start/search/jederzeit/ueberall/alles/egal/dashboardFilter:noRoute/forExport/track/10/1)
- assign additional tracks to new routes
- [run data-management-scripts in admin-area](http://localhost:4001/mytbdev/de/#)

### OPTIONAL data-management: sync with external playlist-directories
- copy images from Phone\Interner gemeinsamer Speicher\Android\data\org.telegram.messenger\files\Telegram\Telegram Images
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

## prepare news
- [create news](http://localhost:4001/mytbdev/de/tdocadmin/create/news)

### export to beta-solr
- [run import from mytbdb to mytbexportbetadb in admin-area](http://localhost:4001/mytbdev/de/#)
- [run import from mytbexportbetadb to beta-solr in admin-area](http://localhost:4001/mytbdev/de/#)

### export to prod-solr
- [run import from mytbdb to mytbexportproddb in admin-area](http://localhost:4001/mytbdev/de/#)
- [run import from mytbexportproddb to prod-solr in admin-area](http://localhost:4001/mytbdev/de/#)
