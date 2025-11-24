const mongoose = require('mongoose')


const TasksFileSchema = new mongoose.Schema({
    taskID: {
        type: String,
        required:  true,
    },
    file: {
        type: String,
        required:  true,
    },
    description: {
        type: String,
        required:  true,
    },
    uploadedByID: {
        type: String,
        required:  true,
    },
    uploadedByName: {
        type: String,
        required:  true,
    },
    uploadDate: {
        type: Date,
        required:  true,
    },
    active: {
        type: Boolean,
        required:  true,
    },
})

module.exports = mongoose.model('TasksFile', TasksFileSchema)