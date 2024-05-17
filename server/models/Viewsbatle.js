const mongoose = require('mongoose')

const BatleSchema = new mongoose.Schema({
    userId: String,
})

const BatleModel = mongoose.model("viewsbatle", BatleSchema)

module.exports = BatleModel