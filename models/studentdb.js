const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/studentsdb');

const Schema = mongoose.Schema;

const studentSchema = new Schema({
    id: { type: Number, unique:true},
    name : { type: String, required: true },
    currentClass : { type: Number, required: true },
    division : { type: String, required: true },
})

const students = mongoose.model("students", studentSchema)

module.exports = students;