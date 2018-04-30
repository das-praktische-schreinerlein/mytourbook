# Data-Management

## initialize environment (once)

### create and initialize database
- create mediadb the master-database (mysql)
```
mysql
source installer/db/mysql/mediadb/step1_create-db.sql
source installer/db/mysql/mediadb/step3_import-data.sql
source installer/db/mysql/mediadb/step2_create-user.sql
```
- create mytb the export-database (mysql)
```
mysql
source installer/db/mysql/mytb/step1_create-db.sql
source installer/db/mysql/mytb/step2_create-user.sql
``` 
- create image-sym-links as admin
```
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
- configure a ```backend.json``` with another port and SqlMediadb
- configure ```src/frontend/environments/environment.ts``` to use this as backend-url 

### beta
- configure a second ```backend.beta.json``` with another port and Solr with ```http://localhost:8983/solr/mytbdev``` as backend
- configure ```src/frontend/environments/environment.beta.ts``` to use this as backend-url 

## do imageimport (several times) 
- preparation and import of media (images, videos) in an separate import-database

### prepare import-folder
- create image-import-folder
```cmd
mkdir D:\Bilder\digifotos\import-2014-08
```
- copy images to import-folder and group in subfolder by date
```
bash
devtools/copyImagesToDateFolder.sh import-2014-08 import-READY/ import-2014-08
```
- autorotate images in import-folder
```
cmd
devtools\autorotateImagesInFolder.bat D:\Bilder\digifotos\import-READY\import-2014-08
```
- manually add location to folder-names 

### image-import into mediadb
- copy images/videos in to 'pics_full' and 'video_full' folder
- convert videos: avi/mov... to mp4
```
d:
cd d:\Projekte\mytourbook 
node dist\backend\serverAdmin.js --command mediaManager --action convertVideosFromMediaDirToMP4 --importDir D:\Bilder\mytbbase\import\video_full\ --outputDir D:\Bilder\mytbbase\import\video_full\ --debug true
``` 
- rotate mp4-videos
```
d:
cd d:\Projekte\mytourbook 
node dist\backend\serverAdmin.js --command mediaManager --action rotateVideo  --rotate 270 --debug true --srcFile D:\Bilder\mytbbase\import\video_full\import-2015-05_20150410-bad-brambach\CIMG6228.MOV.MP4
``` 
- generate json-import-file
```cmd
d:
cd d:\Projekte\mytourbook 
node dist\backend\serverAdmin.js -c config\backend.json  --command mediaManager --action generateSDocsFromMediaDir --importDir D:\Bilder\mytbbase\import\pics_full\ --debug true > D:\Bilder\mytbbase\import\mediadb-import-images.json 
node dist\backend\serverAdmin.js -c config\backend.json  --command mediaManager --action generateSDocsFromMediaDir --importDir D:\Bilder\mytbbase\import\video_full\ --debug true > D:\Bilder\mytbbase\import\mediadb-import-videos.json 
```
- manually fix json-import-file (locationnames...)
- create sqlite database
    - execute *installer/db/sqlite/mediadb/step1_import-data.sql*
    - execute *installer/db/sqlite/mediadb/step2_pepare-data.sql*
- load data
```
d:
cd d:\Projekte\mytourbook 
node dist\backend\serverAdmin.js --debug --command loadSdoc  -c config\backend.json -f D:\Bilder\mytbbase\import\mediadb-import-images.json
node dist\backend\serverAdmin.js --debug --command loadSdoc  -c config\backend.json -f D:\Bilder\mytbbase\import\mediadb-import-videos.json
```
- read image-dates and scale images
```
d:
cd d:\Projekte\mytourbook 
rem node dist/backend/serverAdmin.js --command imageManager --action readImageDates -c config/backendt.json
node dist/backend/serverAdmin.js --command imageManager --action scaleImages -c config/backend.json
```
- scale videos
```
d:
cd d:\Projekte\mytourbook 
node dist\backend\serverAdmin.js --command mediaManager --action generateVideoScreenshotFromMediaDir --importDir D:\Bilder\mytbbase\import\video_full\ --outputDir D:\Bilder\mytbbase\import\\video_screenshot\ --debug true
node dist\backend\serverAdmin.js --command mediaManager --action generateVideoPreviewFromMediaDir --importDir D:\Bilder\mytbbase\import\video_full\ --outputDir D:\Bilder\mytbbase\import\video_thumbnail\ --debug true
node dist\backend\serverAdmin.js --command mediaManager --action scaleVideosFromMediaDirToMP4 --importDir D:\Bilder\mytbbase\import\video_full\ --outputDir D:\Bilder\mytbbase\import\video_x600\ --debug true
```
### do data-management....
- [manage locations](http://localhost:4002/mytbdev/de/sdoc/search/jederzeit/ueberall/alles/egal/ungefiltert/relevance/location/10/1)
- [manage tracks](http://localhost:4002/mytbdev/de/sdoc/search/jederzeit/ueberall/alles/egal/ungefiltert/relevance/track/10/1) 
- [checkout images as favorites to export](http://localhost:4002/mytbdev/de/sdoc/search/jederzeit/ueberall/alles/egal/ungefiltert/relevance/track/10/1) 
- [create routes from tracks](http://localhost:4002/mytbdev/de/sdoc/search/jederzeit/ueberall/alles/egal/ungefiltert/relevance/track/10/1)
- [create trips](http://localhost:4002/mytbdev/de/sdocadmin/create/TRIP)

### export to solr
- import from mediadb to mytb
```
mysql mytb
source installer/db/mysql/mytb/step3_import-data.sql
source installer/db/mysql/mytb/step4_import-data-from-mediadb.sql;
```
- import from mytb to solr
```
curl "http://localhost:8983/solr/mytbdev/dataimport?command=full-import&clean=true&commit=true&optimize=true&synchronous=true"
```

