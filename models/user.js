const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

});

// convert userSchema to model and export
module.exports = mongoose.model("user", userSchema); 