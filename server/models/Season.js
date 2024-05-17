const mongoose = require('mongoose')

const SeasonSchema = new mongoose.Schema({
    endDate: Date,

})

const SeasonModel = mongoose.model("season", SeasonSchema)

module.exports = SeasonModel
