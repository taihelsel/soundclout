const express = require("express"),
    router = express.Router(),
    SongDataModel = require(".././models/SongData"),
    mongoose = require("mongoose"),
    songdataHelpers = require("../helpers/songdataHelpers");
// const songUpdateTimer = 3600000; //1 hour timer
const songUpdateTimer = 1800000; //30 min timer
//POST
router.post("/", (req, res) => {
    const targetUrl = req.body.targetUrl.split("?")[0];
    const t = Date.now();
    const diff = t - songUpdateTimer;
    //checking database for song
    SongDataModel.findOne({ url: targetUrl }, function (err, song) {
        if (err) {
            //return error message
            console.log("song err " + err);
        } else if (!err && song) {
            //no err - song is in database
            if (song.lastUpdated <= diff) {
                // Time to request/update song data
                songdataHelpers.reqSong(song.songId, (err, songData) => {
                    const latestData = song.data[song.data.length - 1];
                    if (err === false && songData) {
                        if (
                            songData.likes !== latestData.likes &&
                            songData.comments !== latestData.comments &&
                            songData.plays !== latestData.plays
                        ) {
                            // New data from request. Time to update database.
                            song.data.push({
                                likes: songData.likes,
                                plays: songData.plays,
                                comments: songData.comments,
                                timeStamp: parseInt(t),
                            });
                            song.lastUpdated = t;
                            song.save((err) => {
                                if (err) {
                                    console.log("HADLE SONG UPDATE SAVE ERROR", err);
                                } else {
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
                                            console.log("has related song list");
                                            relatedSongList.forEach((songData) => {
                                                console.log("related song", songData);
                                                SongDataModel.findOne({ url: songData.url }, function (err, relatedSong) {
                                                    if (err) {
                                                        //return error message
                                                        console.log("related song err " + err);
                                                    } else if (!err && relatedSong) {
                                                        const latestData = relatedSong.data[relatedSong.data.length - 1];
                                                        //no err - song is in database
                                                        if (
                                                            songData.likes !== latestData.likes &&
                                                            songData.comments !== latestData.comments &&
                                                            songData.plays !== latestData.plays
                                                        ) {
                                                            // New data from request. Time to update database.
                                                            relatedSong.data.push({
                                                                likes: songData.likes,
                                                                plays: songData.plays,
                                                                comments: songData.comments,
                                                                timeStamp: parseInt(t),
                                                            });
                                                            relatedSong.lastUpdated = t;
                                                            relatedSong.save((err) => {
                                                                if (err) {
                                                                    console.log("HADLE RELATED SONG UPDATE SAVE ERROR", err);
                                                                } else {
                                                                    console.log(relatedSong.title + " was updated");
                                                                }
                                                            });
                                                        }
                                                    } else if (!err && !relatedSong) {
                                                        //no err - add song to db
                                                        const newSong = new SongDataModel({
                                                            songId: songData.songId,
                                                            url: songData.url,
                                                            title: songData.title,
                                                            data: [{
                                                                likes: songData.likes,
                                                                plays: songData.plays,
                                                                comments: songData.comments,
                                                                timeStamp: parseInt(t),
                                                            }],
                                                            lastUpdated: t,
                                                        });
                                                        newSong.save((err) => {
                                                            if (err) {
                                                                console.log("HADLE SONG SAVE ERROR", err);
                                                            } else console.log("related song saved");
                                                        });
                                                    }
                                                });

                                            });
                                        } else {
                                            //return error message
                                            console.log("err requesting song data", err);
                                        }
                                        res.send(dataToBeSent);
                                    });
                                }
                            });
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
                    console.log("song", songData);
                    const newSong = new SongDataModel({
                        songId: songData.songId,
                        url: songData.url,
                        title: songData.title,
                        data: [{
                            likes: songData.likes,
                            plays: songData.plays,
                            comments: songData.comments,
                            timeStamp: parseInt(t),
                        }],
                        lastUpdated: t,
                    });
                    newSong.save((err) => {
                        if (err) {
                            console.log("HADLE SONG SAVE ERROR", err);
                        } else res.send({
                            songId: newSong.songId,
                            url: newSong.url,
                            title: newSong.title,
                            data: newSong.data,
                            lastUpdated: newSong.lastUpdated,
                            offsetTimer: songUpdateTimer,
                        });
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