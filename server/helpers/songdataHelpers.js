const cheerio = require('cheerio'),
    XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest,
    apiKeyUpdateTimer = 172800000; // 48 hr timer

/*REQ HELPERS*/
const fetchNewAPIKey = (cb) => {
    let err = false; // <- return error message in here
    const xhr = new XMLHttpRequest();
    const xhr2 = new XMLHttpRequest();
    xhr.addEventListener("load", function () {
        const responseText = this.responseText;
        const $ = cheerio.load(responseText);
        const targetUrl = $("body > script:nth-child(8)").attr("src");
        xhr2.addEventListener("load", function () {
            let responseText = this.responseText;
            const s = responseText.indexOf(",client_id:"), f = responseText.indexOf(",env:\"");
            responseText = responseText.substring(s, f);
            let apiKey = responseText.replace(",client_id:\"", "");
            apiKey = apiKey.replace("\"", "");
            cb(err, apiKey);
        });
        xhr2.open("GET", targetUrl);
        xhr2.send();
    });
    xhr.open("GET", "https://soundcloud.com/");
    xhr.send();
}
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

exports.reqSong = (songId, key, cb) => {
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
    xhr.open("GET", `https://api-v2.soundcloud.com/tracks/${songId}?client_id=${key}`);
    xhr.send();
}

exports.reqRelatedSongs = (songId, key, limit, cb) => {
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
    xhr.open("GET", `https://api-v2.soundcloud.com/tracks/${songId}/related?client_id=${key}&limit=${limit}`);
    xhr.send();
}

/*DB HELPERS*/
exports.shouldUpdate = (oldData, newData) => {
    /*
        expects two objects with song data. 
        if oldData = newData return false
        else return true
    */
    return oldData.likes === newData.likes && oldData.comments === newData.comments && oldData.plays === newData.plays ? false : true;
}
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

exports.handleAPIKey = (model, cb) => {
    model.find({}, function (err, key) {
        if (err) console.log("err finding api key in db");
        else if (key.length < 1) {
            //add new api key
            fetchNewAPIKey((err, v) => {
                const newApiKey = new model({ key: v });
                newApiKey.save((err) => {
                    if (err) console.log("error saving new api key");
                    else cb(v)
                });
            });
        } else {
            const apiKey = key[0];
            if (Date.now() - apiKeyUpdateTimer >= apiKey.timeStamp) {
                // must update api key
                fetchNewAPIKey((err, v) => {
                    apiKey.key = v;
                    apiKey.timeStamp = Date.now();
                    apiKey.save((err) => {
                        if (err) console.log("error saving new api key");
                        else cb(v)
                    });
                });
            } else {
                cb(apiKey.key);
            }
        }
    });
}