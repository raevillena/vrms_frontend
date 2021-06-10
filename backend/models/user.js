const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required:  true,
        minlength:1
    },
    email: {
        type: String,
        required: true,
        minlength:1
    },
    project:{
        type: String,
        required: true,
        minlength:1
    },
    title:{
        type: String,
        required: true,
        minlength:1
    },
    password:{
        type: String,
        required: true,
        minlength:1
    }
})

module.exports = mongoose.model('User', UserSchema)