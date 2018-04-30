echo off
rem job for autorotating jpg-files<br>
rem     requires JPEG-EXIF autorotate - http://pilpi.net/software/JPEG-EXIF_autorotate.php
rem     d:\public_projects\MatImageImportEditor\sbin\autorotateImagesInFolder.bat D:\Bilder\digifotos\test

rem set mypath
set autopath=C:\Program Files (x86)\JPEG-EXIF_autorotate\
"%autopath%\autooperatedir_recursive.bat" "%autopath%\jhead" "%1" "%autopath%" -autorot
