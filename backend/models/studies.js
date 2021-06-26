const mongoose = require('mongoose')


const StudiesSchema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        required:  true,
    },
    createdBy:{
        type: String,
        required: true,
    },
    dateUpdated:{
        type: Date,
        required: true,
    },
    title:{
        type: Boolean,
        required: true
    },
    studyNo:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    project:{
        type: String,
        required: true
    },
    progress:{
        type: String,
        required: true
    },
    deadline:{
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Studies', StudiesSchema)