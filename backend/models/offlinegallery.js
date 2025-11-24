const mongoose = require('mongoose')


const OfflineGallerySchema = new mongoose.Schema({
    images: {
        type: String,
        required:  true,
    },
    caption: {
        type: String,
        required:  true,
    },
    user:{
        type: String,
        required:  true,
    },
    studyID: {
        type: String
    },
    updatedBy:{
        type: String
    },
    active:{
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('OfflineGallery', OfflineGallerySchema)