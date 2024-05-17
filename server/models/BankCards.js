const mongoose = require('mongoose')

const BankCardSchema = new mongoose.Schema({
    memberID: String,
    cardNumber: String,
    CardName: String,
    expDate: String,
    cvcNumber: String
})

const BankCardModel = mongoose.model("bankcard", BankCardSchema)

module.exports = BankCardModel
