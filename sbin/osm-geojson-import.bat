SET SCRIPTPATH=%~dp0
SET CWD=%cd%

call %SCRIPTPATH%configure-environment.cmd

cd %SCRIPTPATH%
cd %MYCMS%
echo *****************************************************************
echo import osm geojson
echo *****************************************************************

for %f in (%OSMDIR%\*.tdoc.json) do (
    echo %%~nf
    node dist\backend\serverAdmin.js ^
        --debug ^
        --command loadTourDoc ^
        --action loadDocs ^
        --adminclibackend config/adminCli.dev.json ^
        --backend config/backend.dev.json ^
        --file %OSMDIR%/%%~nf.tdoc.json ^
        --renameFileAfterSuccess true
)

cd %CWD%

