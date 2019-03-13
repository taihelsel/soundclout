const express = require("express"),
    router = express.Router(),
    cheerio = require('cheerio'),
    XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
    SongDataModel = require(".././models/SongData"),
    mongoose = require("mongoose");
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
            //song is in database
            const t = Date.now();
            const diff = t - songUpdateTimer;
            if (song.lastUpdated <= diff) {
                //update song data
                // song.updateData({})
                console.log("UPDATE SONG DATA");
            }
        } else if (!err && !song) {
            //no err - add song to db
            console.log("song " + song);
        }
    });
    //fetching song data
    // const xhr = new XMLHttpRequest();
    // xhr.addEventListener("load", function () {
    //     const responseText = this.responseText;
    //     const $ = cheerio.load(responseText);
    //     const song = {
    //         url: $("meta[property='og:url']").attr("content"),
    //         title: $("meta[property='twitter:title']").attr("content"),
    //         likes: $("meta[property='soundcloud:like_count']").attr("content"),
    //         plays: $("meta[property='soundcloud:play_count']").attr("content"),
    //         comments: $("meta[property='soundcloud:comments_count']").attr("content"),
    //     };
    //     res.send(song);
    // });
    // xhr.open("GET", targetUrl);
    // xhr.send();

});

module.exports = router;