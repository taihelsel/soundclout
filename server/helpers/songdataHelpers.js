const cheerio = require('cheerio'),
    XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
    sndapk = "cQXBZEg50tuw0q10w3TGcKGBKADRLoOO";

/*REQ HELPERS*/

exports.initialSongReq = (targetUrl, cb) => {
    /*
        Use this function if song is not in databse. Will request all the required intial data that is required for the future soundcloud API req.
    */
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
        song.songId = song.songId.replace("soundcloud://sounds:", "");
        cb(err, song);
    });
    xhr.open("GET", targetUrl);
    xhr.send();
}

exports.reqSong = (songId, cb) => {
    /*
        use this function to request song data on songs that are already in the database.
        DO NOT use for a new song. It will not have a valid songID.
        songs requested from the reqRelatedSongs function will have a valid songID so they can use this to req future data without having used the initialSongReq func;
    */
    //Need to do error handling somewhere in here.
    let err = false; // <- return error message in here
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
        const responseJSON = JSON.parse(this.responseText);
        const song = {
            likes: parseInt(responseJSON["likes_count"]),
            plays: parseInt(responseJSON["playback_count"]),
            comments: parseInt(responseJSON["comment_count"]),
        };
        cb(err, song);
    });
    xhr.open("GET", `https://api-v2.soundcloud.com/tracks/${songId}?client_id=${sndapk}`);
    xhr.send();
}

exports.reqRelatedSongs = (songId, limit, cb) => {
    /*
        use this function to request songs from the related list. This will help maximize amount of relevant data being stored in the db while making the least amount of requests to the api.=
        expects a valid songId, a number of songs to request, and a callback to handle the data.
    */
    //Need to do error handling somewhere in here.
    let err = false; // <- return error message in here
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
        const responseJSON = JSON.parse(this.responseText);
        const songs = responseJSON.collection.map((songJSON) => {
            return {
                songId: songJSON.id,
                url: songJSON["permalink_url"],
                title: songJSON.title,
                likes: parseInt(songJSON["likes_count"]),
                plays: parseInt(songJSON["playback_count"]),
                comments: parseInt(songJSON["comment_count"]),
            }
        });
        cb(err, songs);
    });
    xhr.open("GET", `https://api-v2.soundcloud.com/tracks/${songId}/related?client_id=${sndapk}&limit=${limit}`);
    xhr.send();
}

/*DB HELPERS*/

exports.addNewSongToDB = (songData, updateTimer, model, cb) => {
    /*
        expects songData for a song, timer for when song is to be updated, SongDataModel, cb for the save
    */
    const t = Date.now();
    const newSong = new model({
        songId: songData.songId,
        url: songData.url,
        title: songData.title,
        data: [{
            likes: songData.likes,
            plays: songData.plays,
            comments: songData.comments,
            timeStamp: t,
        }],
        lastUpdated: t,
    });
    newSong.save((err) => {
        if (err) {
            cb(err, null);
        } else cb(false, {
            songId: newSong.songId,
            url: newSong.url,
            title: newSong.title,
            data: newSong.data,
            lastUpdated: newSong.lastUpdated,
            offsetTimer: updateTimer,
        });
    });
}

exports.updateSongInDB = (song, newData, cb) => {
    /*
        expects a reference to a song in the db, new data from api req, and a callback.
    */
    const t = Date.now();
    song.data.push({
        likes: newData.likes,
        plays: newData.plays,
        comments: newData.comments,
        timeStamp: t,
    });
    song.lastUpdated = t;
    song.save((err) => {
        if (err) {
            cb(err, null);
        } else cb(false, song);
    });
}