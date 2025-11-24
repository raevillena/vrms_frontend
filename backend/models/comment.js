const mongoose = require('mongoose')


const CommentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required:  true,
    },
    user: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        required: true
    },
    taskId: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Comments', CommentSchema)