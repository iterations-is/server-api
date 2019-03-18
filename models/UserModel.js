/**
 * @file Users Model
 * @author Sergey Dunaevskiy (dunaevskiy) <sergey@dunaevskiy.eu>
 */

// TODO Rewrite to SQL

const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
   ghid: Number,
   username: String,
   typeOfAuth: String,
});

const User = mongoose.model('user', userSchema);

module.exports = User;
