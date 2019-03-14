const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

const songDataSchema = new Schema({
    songId: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    data: [{
        _id: false,
        likes: {
            type: Number,
        },
        plays: {
            type: Number,
        },
        comments: {
            type: Number,
        },
        timeStamp: {
            type: Date,
            default: Date.now
        },
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    created: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model("SongData", songDataSchema);