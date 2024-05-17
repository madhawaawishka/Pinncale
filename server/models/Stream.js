const mongoose = require('mongoose')

const StreamSchema = new mongoose.Schema({
    name: String,
    videoUrl: String, 
    thumbnailUrl: String, 
    description: String,
    viewCount: Number,
    type: String, 
    channel_ID: {
        type: mongoose.Schema.Types.Mixed, // Define as ObjectId
        ref: 'channel' // Reference to the Channel model
    },
    secretVideoCode: String,
    gameType:String
})

const StreamModel = mongoose.model("stream", StreamSchema)

module.exports = StreamModel