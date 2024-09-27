const express = require('express')
const router = express.Router()
const Project = require('../models/projects')
const Program = require('../models/program')
const mongoose = require('mongoose')
const shortid = require('shortid')
const logger = require('../logger')
const jwt = require('jsonwebtoken')

async function auth(req, res, next){
  try {
   let token = req.header('Authorization')
   token = token.split(" ")[1]

   if(token == null){
       return res.sendStatus(401).json({message: "Unauthorized, missing token"})
   }
   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async(err, payload) => {
     if(err){
       return res.sendStatus(401).json({err})
     }
     req.payload =payload
     next()
   })
  } catch(error) {
   logger.log('error', 'access token') 
   next(error)
  } 
}

//create project
router.route('/createproject').post(async (req, res) => {
   try {
    const projectID = shortid.generate() 
    const project = new Project({
        dateCreated: Date.now(),
        createdBy: req.body.user,
        createdByName: req.body.username,
        dateUpdated: Date.now(),
        updatedBy: req.body.user,
        projectName: req.body.projectName,
        projectID: projectID,
        assignee: req.body.assignee,
        program: req.body.program,
        programName: req.body.programName,
        assigneeName: req.body.assigneeName,
        fundingAgency: req.body.fundingAgency,
        fundingCategory: req.body.fundingCategory,
        deadline: req.body.deadline,
        active: true,
        status: 'ONGOING',
        progress: 0
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


 //create program
router.route('/createprogram').post(async (req, res) => {
   try {
    const programID = shortid.generate() 
    const program = new Program({
        dateCreated: Date.now(),
        createdBy: req.body.user,
        programName: req.body.programName,
        programID: programID,
        assignee: req.body.assignee,
        assigneeName: req.body.assigneeName,
        fundingAgency: req.body.fundingAgency,
        fundingCategory: req.body.fundingCategory,
        active: true,
        status: 'ONGOING',
        progress: 0
    })
    const doesExist = await Program.findOne({programName: req.body.programName, active: true})
    if(doesExist){
        res.status(400).json({message: "Program name already exist!"})
    } else{
          const newProgram =  await program.save()
          res.status(201).json({
              message1: `Program created with the id ${programID}`,
              newProgram})
          }
   } catch (error) {
    logger.log('error', 'Create project error!')
    res.status(400).json({message: error.message})
   }
 })


 router.get("/getAllProject", async(req,res) => {
    try {
       Project.find({}, function(err, projects) {
        res.send(projects);  
      });
    } catch (error) {
      logger.log('error', 'Get all project error!')  
    }
  })

  router.get("/getAllPrograms", async(req,res) => {
    try {
       Program.find({}, function(err, programs) {
        res.send(programs);  
      });
    } catch (error) {
      logger.log('error', 'Get all project error!')  
    }
  })


  router.get("/getProjectforDirector/:id", async(req,res) => {
    try {
       Project.find({"active": true, "program": req.params.id}, function(err, projects) {
        res.send(projects);  
      });
    } catch (error) {
      logger.log('error', 'Get all project error!')  
    }
  })


  //get all project assigned to the manager with programs

  router.get("/getProjectforManager/:user/:program", auth, async(req,res) => {
    try {
      await Project.find({"assignee": req.params.user, "program": req.params.program, "active": true}, function(err, projects) {
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

  router.get("/getProgramforManager/:user", auth, async(req,res) => {
    try {
      await Program.find({"assignee": req.params.user, "active": true}, function(err, projects) {
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

  router.post("/deleteProject", auth, async(req,res) => {
    try {
      await Project.findOneAndUpdate({"_id": req.body._id},{"active": false, "deletedDate": Date.now(), 'deletedBy': req.body.user}, function(err, projects) {
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


  router.post("/updateProgram", auth, async(req,res) => {
    try {
      await Program.findOneAndUpdate({"programID": req.body.program},{'editedBy': req.body.user, 'editedDate': Date.now(), 'programName': req.body.programName, 'assignee':req.body.assignee, 'assigneeName': req.body.assigneeName, 'fundingAgency': req.body.fundingAgency, 'fundingCategory': req.body.fundingCategory}, function(err, projects) {
        if(err){
            logger.log('error', 'Update Program')
        } else{
          res.send({message: "Program Updated"})
        }
      });
    } catch (error) {
      logger.log('error', 'Update program find error: /updateProgram')  
    }
  })
  
  router.post("/updateProject", auth, async(req,res) => {
    try {
      await Project.findOneAndUpdate({"projectID": req.body.id},{'editedBy': req.body.user, 'editedDate': Date.now(), 'program': req.body.program, 
      'assignee':req.body.assignee, 'assigneeName': req.body.assigneeName, 'projectName': req.body.projectName, 'deadline': req.body.deadline, 'fundingAgency': req.body.fundingAgency, 'fundingCategory': req.body.fundingCategory
    }, function(err, projects) {
        if(err){
            logger.log('error', 'Update Program')
        } else{
          res.send({message: "Project Updated"})
        }
      });
    } catch (error) {
      logger.log('error', 'Update project find error: /updateProject')  
    }
  })

  router.get("/getallprogramsdashoard", async(req,res) => {
    try {
       Program.find({active: true}, function(err, programs) {
        res.send(programs);  
      });
    } catch (error) {
      logger.log('error', 'Get all project error!')  
    }
  }
  )
//on get all assigned project in user
  router.get("/getAllProjectForIndividualPerformance/:assignee", async(req,res) => {
    try {
       Project.find({'active': true, 'assignee': req.params.assignee}, function(err, projects) {
        res.send(projects);  
      });
    } catch (error) {
      logger.log('error', 'Get all project error!')  
    }
  })

  router.get("/getAllProgramForIndividualPerformance/:assignee", async(req,res) => {
    try {
       Program.find({'active': true, 'assignee': req.params.assignee}, function(err, projects) {
        res.send(projects);  
      });
    } catch (error) {
      logger.log('error', 'Get all project error!')  
    }
  })

  router.get("/getAllProjectMonitor/:assignee", async(req,res) => {
    try {
       Program.find({'active': true, 'assignee': req.params.assignee}, function(err, projects) {
        res.send(projects);  
      });
    } catch (error) {
      logger.log('error', 'Get all project error!')  
    }
  })

  router.post("/updateprogramadmin", auth, async(req,res) => {
    try {
      await Program.findOneAndUpdate({"programID": req.body.program},{'editedBy': req.body.user, 'editedDate': Date.now(), 'programName': req.body.programName, 'assignee':req.body.assignee, 'assigneeName': req.body.assigneeName, 
      'active': req.body.active, 'status':req.body.status, 'fundingAgency': req.body.fundingAgency, 'fundingCategory': req.body.fundingCategory}, function(err, projects) {
        if(err){
            logger.log('error', 'Update Program')
        } else{
          res.send({message: "Program Updated"})
        }
      });
    } catch (error) {
      logger.log('error', 'Update program find error: /updateProgram')  
    }
  })

  router.post("/updateprojectadmin", auth, async(req,res) => {
    try {
      await Project.findOneAndUpdate({"projectID": req.body.id},{'editedBy': req.body.user, 'editedDate': Date.now(), 'program': req.body.program, 
      'assignee':req.body.assignee, 'assigneeName': req.body.assigneeName, 'projectName': req.body.projectName, 'deadline': req.body.deadline, 'active': req.body.active, 'progress': req.body.progress,
      'status': req.body.status, 'fundingCategory': req.body.fundingCategory, 'fundingAgency': req.body.fundingAgency
    }, function(err, projects) {
        if(err){
            logger.log('error', 'updateprojectadmn')
        } else{
          res.send({message: "Project Updated"})
        }
      });
    } catch (error) {
      logger.log('error', 'Update project find error: /updateprojectadmn')  
    }
  })

 module.exports = router