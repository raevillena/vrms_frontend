const mongoose = require('mongoose')


const DocumentationSchema = new mongoose.Schema({
    introduction: {
        type: String,
    },
    methodology: {
        type: String,
    },
    resultsAndDiscussion: {
        type: String,
    },
    conclusion: {
        type: String,
    },
    studyID: {
        type: String,
    }
})

module.exports = mongoose.model('Documentation', DocumentationSchema)