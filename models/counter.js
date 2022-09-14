const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/studentsdb');

const Schema = mongoose.Schema;

const counterSchema = new Schema({
    id: String,
    sequence_value : Number
})

const counter = mongoose.model("counter", counterSchema);

module.exports = counter;