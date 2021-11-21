const mongoose = require('mongoose')



const BackupSchema = new mongoose.Schema({
    backupDate: {
        type: Date,
        required:  true
    },
    backupBy:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    data:{
        type: Array,
        required: true
    },
    columns:{
        type: Array,
        required: true
    },
    studyID:{
        type: String,
        required: true
    },
    tableID:{
        type: String,
        require: true
    },
})


module.exports = mongoose.model('Backup', BackupSchema)