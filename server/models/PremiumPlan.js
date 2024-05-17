const mongoose = require('mongoose')

const PremiumPlanSchema = new mongoose.Schema({
    planType: String,
    price: Number,
    timePeriod: String
})

const PremiumPlanModel = mongoose.model("premiumplan", PremiumPlanSchema)

module.exports = PremiumPlanModel
