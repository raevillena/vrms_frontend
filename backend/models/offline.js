const mongoose = require('mongoose')



const OfflineSchema = new mongoose.Schema({
    dateUploaded: {
        type: Date,
        required:  true
    },
    uploadedBy:{
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        required:  true
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    data:{
        type: Array,
        required: true
    },
    columns:{
        type: Array,
        required: true
    },
    active:{
        type: Boolean
    },
    tableID:{
        type: String,
        require: true
    },
    deletedDate: {
        type: Date,
    },
    deletedBy:{
        type: String,
    },
})


module.exports = mongoose.model('Offline', OfflineSchema)