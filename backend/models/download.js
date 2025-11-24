const mongoose = require('mongoose')


const DownloadSchema = new mongoose.Schema({
    downloadDate: {
        type: Date,
        required: true
    },
    downloadedBy: {
        type: String,
        required: true
    },
    tableID: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Download', DownloadSchema)