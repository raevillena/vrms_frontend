const mongoose = require('mongoose')


const ProjectSchema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        required:  true,
    },
    createdBy:{
        type: String,
        required: true,
    },
    createdByName:{
        type: String,
        required: true,
    },
    dateUpdated:{
        type: Date,
        required: true,
    },
    updatedBy:{
        type: String,
        required: true,
    },
    projectName:{
        type: String,
        required: true,
        unique: true
    },
    projectID:{
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
        type: Number,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    program:{
        type: String,
        required: true
    },
    programName:{
        type: String,
        required: true
    },
    deletedDate: {
        type: Date,
    },
    deletedBy:{
        type: String,
    },
    dateEdited: {
        type: Date,
    },
    editedBy:{
        type: String,
    },
    deadline:{
        type: Date
    },
    fundingCategory:{
        type: String,
        required: true
    },
    fundingAgency:{
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Project', ProjectSchema)