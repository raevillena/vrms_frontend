const mongoose = require('mongoose')


const TokenSchema = new mongoose.Schema({
    id: {
        type: String,
        required:  true,
    },
    refreshToken:{
        type: String,
        required: true,
    },
    refreshTokenDuration:{
        type: String,
        required: true,
    },
    isActive:{
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('Token', TokenSchema)