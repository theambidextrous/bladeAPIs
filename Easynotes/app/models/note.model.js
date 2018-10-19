const mongoose = require('mongoose');

//create a model/scheme which will then create db table
const NoteSchema = mongoose.Schema({
    title: String,
    content: String },
    {
    timestamps: true
});
//table name is Note
module . exports = mongoose.model('Note', NoteSchema);