SET SCRIPTPATH=%~dp0
SET CWD=%cd%

call %SCRIPTPATH%configure-environment.cmd

cd %SCRIPTPATH%
cd %MYCMS%
echo *****************************************************************
echo start solr
echo *****************************************************************

set CMD=dist\contrib\solr\bin\solr.cmd start -V -f -q -p %SOL_PORT%
echo start solr "%CMD%"
%CMD%
cd %CWD%

