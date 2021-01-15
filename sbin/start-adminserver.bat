SET SCRIPTPATH=%~dp0
SET CWD=%cd%

call %SCRIPTPATH%configure-environment.cmd

IF NOT "%START_ADMINSERVER%"=="true" GOTO END

cd %SCRIPTPATH%
cd %MYCMS%
call npm run adminserver-serve-%1%
cd %CWD%

:END
