const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
   ghid: Number,
   username: String,
});

const User = mongoose.model('user', userSchema);

module.exports = User;
