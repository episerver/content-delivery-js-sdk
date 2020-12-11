@ECHO OFF
SETLOCAL

REM Set up database
SET Backend=backend
IF EXIST %Backend%\App_Data (
    ECHO Remove all files from the App_Data folder
    DEL %Backend%\App_Data\*.* /F /Q || Exit /B 1
) ELSE (
    MKDIR %Backend%\App_Data || Exit /B 1
)

REM Copy the database files to the site.
SET Data=data
XCOPY /y/i %Data%\DefaultSiteContent.episerverdata %Backend%\App_Data\ || Exit /B 1
XCOPY /y/i/k %Data%\musicfestival.mdf %Backend%\App_Data\ || Exit /B 1
XCOPY /y/i/k %Data%\GeoLiteCity.dat %Backend%\App_Data\ || Exit /B 1

EXIT /B %ERRORLEVEL%
