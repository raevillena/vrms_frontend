const express = require('express')
const router = express.Router()
const Project = require('../models/projects')
const mongoose = require('mongoose')
const shortid = require('shortid')
const logger = require('../logger')

//create project
router.route('/createproject').post(async (req, res) => {
   try {
    const projectID = shortid.generate() 
    const project = new Project({
        dateCreated: Date.now(),
        createdBy: req.body.user,
        dateUpdated: Date.now(),
        updatedBy: req.body.user,
        projectName: req.body.projectName,
        projectID: projectID,
        assignee: req.body.assignee,
        active: true
    })
    const doesExist = await Project.findOne({projectName: req.body.projectName})
    if(doesExist){
        res.status(400).json({message: "Project Name already exist!"})
    } else{
        const newProject =  await project.save()
        res.status(201).json({
            message: `Project created with the id ${projectID}`,
            newProject})
    }
   } catch (error) {
    logger.log('error', 'Create project error!')
    res.status(400).json({message: error.message})
   }
 })


 router.get("/getAllProject", async(req,res) => {
    try {
       Project.find({}, {"projectName": 1, _id: 0}, function(err, projects) {
        res.send(projects);  
      });
    } catch (error) {
      logger.log('error', 'Get all project error!')  
    }
  })


  //get all project assigned to the manager
  router.post("/getProjectforManager", async(req,res) => {
    try {
      await Project.find({"assignee": req.body.user, "active": true}, function(err, projects) {
        if(err){
            logger.log('error', 'Project find error: /getProjectforManager')
        } else{
            res.send(projects)
        }
      });
    } catch (error) {
      logger.log('error', 'Project find error: /getProjectforManager')  
    }
  })

  //delete project by the manager

  router.post("/deleteProject", async(req,res) => {
    console.log(req.body)
    try {
      await Project.findOneAndUpdate({"_id": req.body._id},{"active": false}, function(err, projects) {
        if(err){
            logger.log('error', 'Project delete')
        } else{
          res.send({message: "Deleted!"})
        }
      });
    } catch (error) {
      logger.log('error', 'Project find error: /getProjectforManager')  
    }
  })


 module.exports = router