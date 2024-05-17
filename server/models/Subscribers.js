const mongoose = require('mongoose')

const SubscriberSchema = new mongoose.Schema({ 
    memberID: String,
    channelID: String,   
})

const SubscriberModel = mongoose.model("subscribers", SubscriberSchema)

module.exports = SubscriberModel