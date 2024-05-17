const mongoose = require('mongoose')

const feedbackSchema =new mongoose.Schema({
    name:String,
    email:String,
    feedback:String,
    streamid: String
})

const FeedbackModel  = mongoose.model("feedbacks",feedbackSchema )
module.exports=FeedbackModel 