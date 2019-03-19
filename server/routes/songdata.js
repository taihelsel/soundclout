const express = require("express"),
    router = express.Router(),
    SongDataModel = require(".././models/SongData"),
    mongoose = require("mongoose"),
    songdataHelpers = require("../helpers/songdataHelpers");
// const songUpdateTimer = 3600000; //1 hour timer
const songUpdateTimer = 1800000; //30 min timer
// const songUpdateTimer = 30000; //30 sec timer
//POST
router.post("/", (req, res) => {
    const targetUrl = req.body.targetUrl.split("?")[0];
    const t = Date.now();
    const diff = t - songUpdateTimer;
    //checking database for song
    SongDataModel.findOne({ url: targetUrl }, function (err, song) {
        if (err) console.log("song err " + err);
        else if (!err && song) {
            //no err - song is in database
            if (song.lastUpdated <= diff) {
                // Time to request/update song data
                songdataHelpers.reqSong(song.songId, (err, songData) => {
                    const latestData = song.data[song.data.length - 1];
                    if (err === false && songData) {
                        if (songdataHelpers.shouldUpdate(latestData, songData)) {
                            // New data from request. Time to update database.
                            songdataHelpers.updateSongInDB(song, songData, (err, song) => {
                                if (err) console.log("error updating song in database.", err);
                                else {
                                    // Going to request related songs here.
                                    const dataToBeSent = { //this obj is the originally requested data and will  be sent to front end after checking for related songs
                                        songId: song.songId,
                                        url: song.url,
                                        title: song.title,
                                        data: song.data,
                                        lastUpdated: song.lastUpdated,
                                        offsetTimer: songUpdateTimer,
                                    };
                                    const relatedSongLimit = 10;

                                    songdataHelpers.reqRelatedSongs(song.songId, relatedSongLimit, (err, relatedSongList) => {
                                        if (err === false && relatedSongList.length > 0) {
                                            relatedSongList.forEach((songData) => {
                                                SongDataModel.findOne({ url: songData.url }, function (err, relatedSong) {
                                                    if (err) console.log("related song err " + err);
                                                    else if (!err && relatedSong) {
                                                        const latestData = relatedSong.data[relatedSong.data.length - 1];
                                                        //no err - song is in database
                                                        if (songdataHelpers.shouldUpdate(latestData, songData)) {
                                                            // New data from request. Time to update database.
                                                            songdataHelpers.updateSongInDB(relatedSong, songData, (err, song) => {
                                                                if (err) console.log("error updating related song in database");
                                                                else console.log(song.title, "was updated");
                                                            });
                                                        }
                                                    } else if (!err && !relatedSong) {
                                                        //no err - add song to db
                                                        songdataHelpers.addNewSongToDB(songData, songUpdateTimer, SongDataModel, (err, data) => {
                                                            if (err) console.log("error adding new song to database");
                                                            else console.log(data.title, "was added to db");
                                                        });
                                                    }
                                                });

                                            });
                                        } else console.log("err requesting song data", err);
                                        res.send(dataToBeSent);
                                    });
                                }
                            })
                        } else {
                            // No new data from request. 
                            // Just update time stamp and then send data from db.
                            song.lastUpdated = t;
                            song.save((err) => {
                                if (err) {
                                    console.log("HADLE SONG UPDATE SAVE ERROR", err);
                                } else res.send({
                                    songId: song.songId,
                                    url: song.url,
                                    title: song.title,
                                    data: song.data,
                                    lastUpdated: song.lastUpdated,
                                    offsetTimer: songUpdateTimer,
                                });
                            });
                        }

                    } else {
                        //return error message
                        console.log("err requesting song data", err);
                    }
                })
            } else {
                // Not time to request/update data.
                // Sending the data from db.
                res.send({
                    songId: song.songId,
                    url: song.url,
                    title: song.title,
                    data: song.data,
                    lastUpdated: song.lastUpdated,
                    offsetTimer: songUpdateTimer,
                });
            }
        } else if (!err && !song) {
            //no err - add song to db
            songdataHelpers.initialSongReq(targetUrl, (err, songData) => {
                if (err === false && songData) {
                    songdataHelpers.addNewSongToDB(songData, songUpdateTimer, SongDataModel, (err, data) => {
                        if (err) console.log("error adding new song to database");
                        else res.send(data);
                    });
                } else {
                    //return error message
                    console.log("err requesting song data", err);
                }
            });
        }
    });
});

module.exports = router;