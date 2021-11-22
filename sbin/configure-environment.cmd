SET MYSCRIPTPATH=%~dp0
set MYCMS=%MYSCRIPTPATH%..\
set CONFIG_BASEDIR=%MYCMS%config\
set MYTB=%MYSCRIPTPATH%..\
set MYTBTOOLS=%MYTB%\sbin\
set LIRETOOLS=F:\Projekte\liretools\

set DIGIFOTOS_BASEDIR=F:\playground\mytb-test\Bilder\digifotos\
set VIDEOS_BASEDIR=F:\playground\mytb-test\Bilder\Videos\
set EXPORT_BASEDIR=F:\playground\mytb-test\export\
set MYTB_IMPORT_MEDIADIR=F:\playground\mytb-test\mytbbase\
set MYTB_MEDIADIR=F:\playground\mytb-test\mytbmediabase\
set MYTB_INDEXDIR=F:\playground\mytb-test\mytbindex\
set MYTB_INDEXSRC_MEDIADIR=%MYTB_MEDIADIR%pics_x100\

set SOLR_PORT=9999
set SOLR_JETTY_HOST=127.0.0.1
set SOLR_HOST=127.0.0.1
set SOLR_OPTS=-Dsolr.jetty.request.header.size=65535
set START_ADMINSERVER=true

set AUTOSTARTIMPORT=false
set AUTOSTARTEXPORT=true
