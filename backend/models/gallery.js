const mongoose = require('mongoose')


const GallerySchema = new mongoose.Schema({
    studyID: {
        type: String,
        required:  true,
    },
    images: {
        type: String,
        required:  true,
    },
    caption: {
        type: String,
        required:  true,
    },
    active:{
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('Gallery', GallerySchema)