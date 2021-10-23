const mongoose = require('mongoose')


const TasksSchema = new mongoose.Schema({
    tasksTitle: {
        type: String,
        required:  true,
    },
    tasksDescription: {
        type: String,
        required:  true,
    },
    dateCreated: {
        type: Date,
        required:  true,
    },
    lastUpdated: {
        type: Date,
        required:  true,
    },
    deadline: {
        type: Date,
        required:  true,
    },
    createdBy: {
        type: String,
        required:  true,
    },
    updatedBy: {
        type: String,
        required:  true,
    },
    assignee: {
        type: Array,
        required:  true,
    },
    assigneeName: {
        type: Array,
        required:  true,
    },
    status: {
        type: String,
        required:  true,
    },
    studyName: {
        type: String,
        required:  true,
    },
    projectName: {
        type: String,
        required:  true,
    },
    active: {
        type: Boolean,
        required:  true,
    },
    deletedDate: {
        type: Date,
    },
    deletedBy:{
        type: String,
    },
    objective:{
        type: String,
        required: true
    },
    verification:{
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Tasks', TasksSchema)