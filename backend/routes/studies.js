const express = require('express')
const router = express.Router()
const Studies = require('../models/studies')
const mongoose = require('mongoose')
const shortid = require('shortid')

//create study
router.post('/createstudy', async(req, res) => {
    console.log(req.body)
    const studyID = shortid.generate() 
    const study = new Studies({
        dateCreated: Date.now(),
        createdBy: "test",
        dateUpdated: Date.now(),
        updatedBy: "test",
        studyTitle: req.body.title,
        studyID: studyID,
        assignee: req.body.assignee,
        status: "ONGOING",
        progress: 0,
        projectName: req.body.projectName,
        deadline: req.body.deadline
    })
    try {
        const doesExist = await Studies.findOne({studyTitle: req.body.title})
        if(doesExist){
            console.log("Project name already taken")
            res.status(400).json({message: "Study title already exist!"})
        } else{
            const newStudy =  await study.save()
            console.log(newStudy)
            res.status(201).json({
                message: `Study created with the id ${studyID}`,
            newStudy})
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({message: error.message})
    }
})

module.exports = router