const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const songAPISchema = new Schema({
    key: {
        type: String,
        required: true,
    },
    timeStamp: {
        type: Number,
    },
});
module.exports = mongoose.model("SongAPIKey", songAPISchema);