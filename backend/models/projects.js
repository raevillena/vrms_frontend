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
    active:{
        type: Boolean
    },
    progress:{
        type: Number
    }
})

module.exports = mongoose.model('Project', ProjectSchema)