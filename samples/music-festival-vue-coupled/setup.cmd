@ECHO OFF
SETLOCAL

SET BASE=.\App_Data

ECHO Removed all files from the App_Data folder
IF EXIST %BASE%\blobs\ RMDIR %BASE%\blobs\ /S/Q || EXIT /B 1
IF EXIST %BASE%\musicfestival.mdf DEL %BASE%\musicfestival.mdf /F/Q || EXIT /B 1
IF EXIST %BASE%\musicfestival_log.ldf DEL %BASE%\musicfestival_log.ldf /F/Q || EXIT /B 1

ECHO Created new database
XCOPY %BASE%\db.mdf %BASE%\musicfestival.mdf* /Y/C || EXIT /B 1

EXIT /B %ERRORLEVEL%
