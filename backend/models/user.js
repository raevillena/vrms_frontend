const mongoose = require('mongoose')
const bcrypt = require ('bcrypt');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required:  true,
        minlength:1
    },
    avatarFilename:{
        type: String,
    },
    email: {
        type: String,
        required: true,
        minlength:1,
        unique: true,
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
    },
})

UserSchema.pre('save', async function(next){
    try {
        let salt = await bcrypt.genSalt(10)
        let hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
    } catch (error) {
        console.error(error)
    }
    return next()
})
module.exports = mongoose.model('User', UserSchema)