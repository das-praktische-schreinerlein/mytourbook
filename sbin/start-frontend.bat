SET SCRIPTPATH=%~dp0
SET CWD=%cd%

call %SCRIPTPATH%configure-environment.cmd

cd %SCRIPTPATH%
cd %MYCMS%
npm run frontendserver-serve-%1%-de
cd %CWD%

