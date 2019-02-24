const express = require("express"),
    router = express.Router(),
    cheerio = require('cheerio'),
    XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

//POST
router.post("/", (req, res) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function(){
        const responseText = this.responseText;
        const $ = cheerio.load(responseText);
        const song = {
            url:$("meta[property='og:url']").attr("content"),
            title:$("meta[property='twitter:title']").attr("content"),
            likes:$("meta[property='soundcloud:like_count']").attr("content"),
            plays:$("meta[property='soundcloud:play_count']").attr("content"),
            comments:$("meta[property='soundcloud:comments_count']").attr("content"),
        }
        res.send(song);
    });
    xhr.open("GET", "https://soundcloud.com/eddyzags/mac-miller-objects-in-the");
    xhr.send();
});

module.exports = router;