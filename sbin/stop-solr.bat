SET SCRIPTPATH=%~dp0
SET CWD=%cd%

call %SCRIPTPATH%configure-environment.cmd

cd %SCRIPTPATH%
cd %MYCMS%
echo *****************************************************************
echo stop solr
echo *****************************************************************

set CMD=dist\contrib\solr\bin\solr.cmd stop -p %SOL_PORT%
echo stop solr "%CMD%"
%CMD%
cd %CWD%

