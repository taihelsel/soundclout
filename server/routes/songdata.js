const express = require("express"),
    router = express.Router(),
    SongDataModel = require(".././models/SongData"),
    mongoose = require("mongoose"),
    songdataHelpers = require("../helpers/songdataHelpers");
// const songUpdateTimer = 3600000; //real timer
const songUpdateTimer = 30000; //testing timer
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
                //update song data
                songdataHelpers.reqData(song.url, (err, songData) => {
                    const latestData = song.data[song.data.length - 1];
                    if (err === false && songData) {
                        if (
                            songData.likes !== latestData.likes &&
                            songData.comments !== latestData.comments &&
                            songData.plays !== latestData.plays
                        ) {
                            //data from ajax req does not match existing data. Much update db.
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
                                } else res.send({
                                    songId: song.songId,
                                    url: song.url,
                                    title: song.title,
                                    data: song.data,
                                    lastUpdated: song.lastUpdated,
                                    offsetTimer: songUpdateTimer,
                                });
                            });
                        } else {
                            //data from ajax req matches data in db (no reason to save). update lastUpdated and send current data.
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
                //sending existing song data.
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
            songdataHelpers.reqData(targetUrl, (err, songData) => {
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
            })
        }
    });
});

module.exports = router;