const mongoose = require('mongoose')


const ViewSchema = new mongoose.Schema({
    viewDate: {
        type: Date,
        required: true
    },
    viewBy: {
        type: String,
        required: true
    },
    tableID: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Viewlog', ViewSchema)