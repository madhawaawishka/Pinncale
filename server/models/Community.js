const mongoose = require('mongoose')

const CommunitySchema = new mongoose.Schema({
    postUrl: String,
    description: String,
    name: String,
    releasedate: Date,
    type: String
})

const CommunityModel = mongoose.model("community", CommunitySchema)

module.exports = CommunityModel
