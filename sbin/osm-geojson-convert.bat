SET SCRIPTPATH=%~dp0
SET CWD=%cd%

call %SCRIPTPATH%configure-environment.cmd

cd %SCRIPTPATH%
cd %MYCMS%
echo *****************************************************************
echo convert osm geojson
echo *****************************************************************

for %%f in (%OSMDIR%\*.geojson) do (
    echo "convert file: %%~nf"
    node dist\backend\serverAdmin.js ^
        --debug ^
        --command convertTourDoc ^
        --action convertGeoJsonToTourDoc ^
        --adminclibackend config/adminCli.dev.json ^
        --backend config/backend.dev.json ^
        --srcFile %OSMDIR%\%%~nf.geojson ^
        --mode RESPONSE ^
        --file %OSMDIR%\%%~nf.tdoc.json ^
        --renameFileIfExists true
)

cd %CWD%

