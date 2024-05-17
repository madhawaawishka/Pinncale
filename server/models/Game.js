const mongoose = require('mongoose')

const GameSchema = new mongoose.Schema({
    name: String,
    gameImageUrl: String,
    configurations: String,
    description: String,
    price: Number,
    downloadCount: Number,
    type: String,
    developer: String,
    publisher: String,
    releasdate: Date
})

const GameModel = mongoose.model("game", GameSchema)

module.exports = GameModel
