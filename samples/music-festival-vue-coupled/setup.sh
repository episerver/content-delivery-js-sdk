#!/usr/bin/env bash

BASE=./App_Data

echo "Removed all files from the App_Data folder"
if [ -d $BASE/blobs ]
then
    rm -rf $BASE/blobs
fi
if [ -d $BASE/musicfestival.mdf ]
then
    rm -rf $BASE/musicfestival.mdf
fi
if [ -d $BASE/musicfestival_log.ldf ]
then
    rm -rf $BASE/musicfestival_log.ldf
fi

echo "Created new database"
cp $BASE/db.mdf $BASE/musicfestival.mdf
