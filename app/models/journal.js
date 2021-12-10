const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const journalSchema = new Schema({
    title: String,
    note: String,
    tag: String,
    userName: String,
    CreatedAt: {type: Date, default: Date.now}

});

// convert journalSchema to model and export
module.exports = mongoose.model("journal", journalSchema); 