const cheerio = require('cheerio'),
    XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

exports.reqData = (targetUrl, cb) => {
    //Need to do error handling somewhere in here.
    let err = false; // <- return error message in here
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
        const responseText = this.responseText;
        const $ = cheerio.load(responseText);
        const song = {
            songId: $("meta[property='twitter:app:url:iphone']").attr("content"),
            url: $("meta[property='og:url']").attr("content"),
            title: $("meta[property='twitter:title']").attr("content"),
            likes: parseInt($("meta[property='soundcloud:like_count']").attr("content")),
            plays: parseInt($("meta[property='soundcloud:play_count']").attr("content")),
            comments: parseInt($("meta[property='soundcloud:comments_count']").attr("content")),
        };
        song.songId = song.songId.replace("soundcloud://sounds:","");
        cb(err, song);
    });
    xhr.open("GET", targetUrl);
    xhr.send();
}