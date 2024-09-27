const mongoose = require('mongoose')


const EditSchema = new mongoose.Schema({
    editDate: {
        type: Date,
        required: true
    },
    editedBy: {
        type: String,
        required: true
    },
    tableID: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Editlog', EditSchema)