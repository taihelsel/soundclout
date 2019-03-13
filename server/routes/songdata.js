const express = require("express"),
    router = express.Router(),
    SongDataModel = require(".././models/SongData"),
    mongoose = require("mongoose"),
    songdataHelpers = require("../helpers/songdataHelpers");
const songUpdateTimer = 3600000;
//POST
router.post("/", (req, res) => {
    const targetUrl = req.body.targetUrl;
    /*
        - check if song is in db
            if(song is in database) then
                if(song needs to be updated) then
                    - fetch song data
                    - update song data in db
            else
                add song to database
        - then send songdata to front end
    */



    //checking database for song
    SongDataModel.findOne({ songId: targetUrl }, function (err, song) {
        if (err) {
            //return error message
            console.log("song err " + err);
        } else if (!err && song) {
            //no err - song is in database
            const t = Date.now();
            const diff = t - songUpdateTimer;
            if (song.lastUpdated <= diff) {
                //update song data
                // song.updateData({})
                console.log("UPDATE SONG DATA");
            }
        } else if (!err && !song) {
            //no err - add song to db
            songdataHelpers.reqData(targetUrl, (err, songData) => {
                if (err === false && songData) {
                    console.log("song", songData);
                } else {
                    //return error message
                    console.log("err requesting song data", err);
                }
            })
        }
    });


});

module.exports = router;