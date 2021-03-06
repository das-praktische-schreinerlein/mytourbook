SET SCRIPTPATH=%~dp0

call cmd /c "%SCRIPTPATH%prepare-app-startup.bat %1%"
start cmd /c "%SCRIPTPATH%start-backend.bat %1%"
start cmd /c "%SCRIPTPATH%start-adminserver.bat %1%"
start cmd /c "%SCRIPTPATH%start-frontend.bat %1%"
