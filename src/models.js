const { model, Schema } = require("mongoose");

module.exports = {
    Avatar: model("Avatar", new Schema({
        url: {
            type: String,
            required: true
        },
        user: {
            type: Number,
            required: true
        },
        uploader: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    })),
};