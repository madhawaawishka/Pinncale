const mongoose = require('mongoose')

const PaymentSchema = new mongoose.Schema({
    description: String,
    officialprice: Number,
    paidamount: Number,
    discount: Number,
    crystaldiscount: Number,
    date: Date,
    memberid: String,
    email: String,
    type: String
})

const PaymentModel = mongoose.model("payment", PaymentSchema)

module.exports = PaymentModel
