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
        likes: {
            type: Number,
        },
        plays: {
            type: Number,
        },
        comments: {
            type: Number,
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
songDataSchema.statics.updateData = function (songId, data, cb) {
    return this.findOneAndUpdate(
        { songId },
        {
            $push: { data },
            $set: { lastUpdated: Date.now() }
        },
        cb);
};
module.exports = mongoose.model("SongData", songDataSchema);