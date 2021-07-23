const mongoose = require('mongoose')



const DatagridSchema = new mongoose.Schema({
    dateCreated: {
        type: Date,
        required:  true
    },
    createdBy:{
        type: String,
        required: true
    },
    dateUpdated:{
        type: Date,
        required: true
    },
    updatedBy:{
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
    active:{
        type: Boolean
    }
})


module.exports = mongoose.model('Datagrid', DatagridSchema)