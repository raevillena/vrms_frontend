const mongoose = require('mongoose')


const ProgramSchema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        required:  true,
    },
    createdBy:{
        type: String,
        required: true,
    },
    programName:{
        type: String,
        required: true,
        unique: true
    },
    programID:{
        type: String,
        required: true
    },
    assignee:{
        type: Array,
        required: true
    },
    assigneeName:{
        type: Array,
        required: true
    },
    active:{
        type: Boolean
    },
    progress:{
        type: Number
    },
    status:{
        type: String,
        required: true
    },
    dateEdited: {
        type: Date,
    },
    editedBy:{
        type: String,
    },
})

module.exports = mongoose.model('Program', ProgramSchema)