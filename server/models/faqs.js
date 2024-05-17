const mongoose = require('mongoose')

const UserSchema=new mongoose.Schema({
    question:String, 
    answer:String
})  

const FaqModel=mongoose.model("faqs",UserSchema)
module.exports=FaqModel