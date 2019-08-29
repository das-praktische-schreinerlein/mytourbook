# Data-Management

# TODO - check docu

## initialize environment (once)

### create and initialize database
- create mytbdb the master-database (mysql)
```bash
mysql -u root -p 
source installer/db/mysql/mytbdb/init_01_create-database.sql
source installer/db/mysql/mytbdb/init_2_create-user.sql
```
- create mytbexportdb the export-database (mysql)
```bash
mysql -u root -p 
source installer/db/mysql/mytbexportdb/init_01_create-database.sql
source installer/db/mysql/mytbexportdb/init_2_create-user.sql
``` 
- create image-sym-links as admin
```bash
d:
cd \Bilder\mytbbase\import
mklink /J link_pics_x600 pics_full
mklink /J link_pics_x100 pics_full
mkdir pics_x600
mkdir pics_x100
mklink /J link_video_x600 video_full
mkdir video_screenshot
mkdir video_thumbnail
mkdir video_x600
exit
```

### configure local environments

### develop 
- configure a ```backend.json``` with another port and SqlMytbDb
- configure ```src/frontend/environments/environment.ts``` to use this as backend-url 

### beta
- configure a second ```backend.beta.json``` with another port and Solr with ```http://localhost:8983/solr/mytbdev``` as backend
- configure ```src/frontend/environments/environment.beta.ts``` to use this as backend-url 

## do imageimport (several times) 
- preparation and import of media (images, videos) in an separate import-database

### prepare import-folder
- create image-import-folder
```bash
mkdir D:\Bilder\digifotos\import-2014-08
```
- copy images to import-folder and group in subfolder by date
```bash
bash
devtools/copyImagesToDateFolder.sh import-2014-08 import-READY/ import-2014-08
```
- autorotate images in import-folder
```bash
cmd
devtools\autorotateImagesInFolder.bat D:\Bilder\digifotos\import-READY\import-2014-08
```
- manually add location to folder-names 

### image-import into mytbdb
- copy images/videos in to 'pics_full' and 'video_full' folder
- convert videos: avi/mov... to mp4
```bash
d:
cd d:\Projekte\mytourbook 
node dist\backend\serverAdmin.js --command mediaManager --action convertVideosFromMediaDirToMP4 --importDir D:\Bilder\mytbbase\import\video_full\ --outputDir D:\Bilder\mytbbase\import\video_full\ --debug true
``` 
- rotate mp4-videos
```bash
d:
cd d:\Projekte\mytourbook 
node dist\backend\serverAdmin.js --command mediaManager --action rotateVideo  --rotate 270 --debug true --srcFile D:\Bilder\mytbbase\import\video_full\import-2015-05_20150410-bad-brambach\CIMG6228.MOV.MP4
``` 
- generate json-import-file
```bash
d:
cd d:\Projekte\mytourbook 
node dist\backend\serverAdmin.js -c config\backend.json  --command mediaManager --action generateTourDocsFromMediaDir --importDir D:\Bilder\mytbbase\import\pics_full\ --debug true > D:\Bilder\mytbbase\import\mytbdb-import-images.json 
node dist\backend\serverAdmin.js -c config\backend.json  --command mediaManager --action generateTourDocsFromMediaDir --importDir D:\Bilder\mytbbase\import\video_full\ --debug true > D:\Bilder\mytbbase\import\mytbdb-import-videos.json 
```
- manually fix json-import-file (locationnames...)
- create sqlite database
    - execute *installer/db/sqlite/mytbdb/step1_import-data.sql*
    - execute *installer/db/sqlite/mytbdb/step2_pepare-data.sql*
- load data
```bash
d:
cd d:\Projekte\mytourbook 
node dist\backend\serverAdmin.js --debug --command loadTourDoc  -c config\backend.json -f D:\Bilder\mytbbase\import\mytbdb-import-images.json
node dist\backend\serverAdmin.js --debug --command loadTourDoc  -c config\backend.json -f D:\Bilder\mytbbase\import\mytbdb-import-videos.json
```
- read image-dates and scale images
```bash
d:
cd d:\Projekte\mytourbook 
rem node dist/backend/serverAdmin.js --command imageManager --action readImageDates -c config/backendt.json
node dist/backend/serverAdmin.js --command imageManager --action scaleImages -c config/backend.json
```
- scale videos
```bash
d:
cd d:\Projekte\mytourbook 
node dist\backend\serverAdmin.js --command mediaManager --action generateVideoScreenshotFromMediaDir --importDir D:\Bilder\mytbbase\import\video_full\ --outputDir D:\Bilder\mytbbase\import\\video_screenshot\ --debug true
node dist\backend\serverAdmin.js --command mediaManager --action generateVideoPreviewFromMediaDir --importDir D:\Bilder\mytbbase\import\video_full\ --outputDir D:\Bilder\mytbbase\import\video_thumbnail\ --debug true
node dist\backend\serverAdmin.js --command mediaManager --action scaleVideosFromMediaDirToMP4 --importDir D:\Bilder\mytbbase\import\video_full\ --outputDir D:\Bilder\mytbbase\import\video_x600\ --debug true
```
### do data-management....
- [manage locations](http://localhost:4002/mytbdev/de/tdoc/search/jederzeit/ueberall/alles/egal/ungefiltert/relevance/location/10/1)
- [manage tracks](http://localhost:4002/mytbdev/de/tdoc/search/jederzeit/ueberall/alles/egal/ungefiltert/relevance/track/10/1) 
- [checkout images as favorites to export](http://localhost:4002/mytbdev/de/tdoc/search/jederzeit/ueberall/alles/egal/ungefiltert/relevance/track/10/1) 
- [create routes from tracks](http://localhost:4002/mytbdev/de/tdoc/search/jederzeit/ueberall/alles/egal/ungefiltert/relevance/track/10/1)
- [create trips](http://localhost:4002/mytbdev/de/tdocadmin/create/TRIP)

### export to solr
- import from mytbdb to mytbexportdb
```bash
mysql mytbexportdb
use mytbexportdb
source installer/db/mysql/mytbexportdb/import_01_create-model.sql
source installer/db/mysql/mytbexportdb/import_02_import-data-from-mytbdb.sql;
```
- import from mytbexportdb to solr
```bash
curl "http://localhost:8983/solr/mytbdev/dataimport?command=full-import&clean=true&commit=true&optimize=true&synchronous=true"
```

