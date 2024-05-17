const mongoose = require('mongoose')

const MemberSchema = new mongoose.Schema({
    crystalCount: Number
    
})

const MemberModel = mongoose.model("Member", MemberSchema)

module.exports = MemberModel



