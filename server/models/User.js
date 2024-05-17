const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  accountType: { type: String, enum: ['admin', 'user'], required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  dob: { type: String, required: true},
  image: { type: String, required: false },
  crystalCount: {type: Number, require: false},
  primium: {type: String, require: false},
  xpCount:{type:Number,require:false},
  memberLevel:{type:Number,require:false},
  league:{type:String,require:false},
});

const User = mongoose.model('User', userSchema);

module.exports = User;