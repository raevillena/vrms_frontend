const express = require('express')
const router = express.Router()
const Project = require('../models/projects')
const mongoose = require('mongoose')
const shortid = require('shortid')

//create project
router.route('/createproject').post(async (req, res) => {
    const projectID = shortid.generate() 
    const project = new Project({
        dateCreated: Date.now(),
        createdBy: "test",
        dateUpdated: Date.now(),
        updatedBy: "test",
        projectName: req.body.projectName,
        projectID: projectID,
        assignee: req.body.assignee
    })
   try {
    const doesExist = await Project.findOne({projectName: req.body.projectName})
    if(doesExist){
        console.log("Project name already taken")
        res.status(400).json({message: "Project Name already exist!"})
    } else{
        const newProject =  await project.save()
        console.log(newProject)
        res.status(201).json({
            message: `Project created with the id ${projectID}`,
            newProject})
    }
   } catch (error) {
    res.status(400).json({message: error.message})
   }
 })


 router.get("/getAllProject", async(req,res) => {
    try {
       Project.find({}, {"projectName": 1, _id: 0}, function(err, projects) {
        res.send(projects);  
      });
    } catch (error) {
      logger.log('error', err)  
    }
  })

 module.exports = router