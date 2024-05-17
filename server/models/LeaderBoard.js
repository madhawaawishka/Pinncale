const mongoose = require('mongoose')

const LeaderBoardSchema = new mongoose.Schema({
    ChannelID: String,
    viewcount: Number,
    channelname: String,
    subscribercount: String
})

const LeaderBoardModel = mongoose.model("leaderboard", LeaderBoardSchema)

module.exports = LeaderBoardModel
