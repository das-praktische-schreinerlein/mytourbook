SET SCRIPTPATH=%~dp0
SET CWD=%cd%

call %SCRIPTPATH%configure-environment.cmd

cd %SCRIPTPATH%
cd %MYCMS%
npm run backend-serve-%1%
cd %CWD%

