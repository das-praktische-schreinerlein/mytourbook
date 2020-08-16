echo off
rem job for autorotating jpg-files<br>
rem     requires JPEG-EXIF autorotate - http://pilpi.net/software/JPEG-EXIF_autorotate.php
rem     F:\public_projects\MatImageImportEditor\sbin\autorotateImagesInFolder.bat D:\Bilder\digifotos\test

rem set mypath
set autopath=C:\Program Files (x86)\JPEG-EXIF_autorotate-2_1\
"%autopath%\autooperatedir_recursive.bat" "%autopath%\jhead" "%1" "%autopath%" -autorot
