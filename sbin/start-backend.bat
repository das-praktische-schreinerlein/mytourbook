SET SCRIPTPATH=%~dp0
SET CWD=%cd%

call %SCRIPTPATH%configure-environment.cmd

cd %SCRIPTPATH%
cd %MYCMS%
call npm run backend-prepare-appenv-%1%
call npm run backend-serve-%1%
cd %CWD%

