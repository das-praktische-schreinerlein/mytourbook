SET SCRIPTPATH=%~dp0
SET MODE=%1%

cd %SCRIPTPATH%\..

echo "starting receiveQueueResponses for mode %MODE%"
node dist\backend\serverAdmin.js --command objectDetectionManager --action receiveQueueResponses --adminclibackend config\adminCli.%MODE%.json  --backend config\backend.%MODE%.json --debug 1
