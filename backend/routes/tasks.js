const express = require('express')
const router = express.Router()
const Tasks = require('../models/tasks')
const logger = require('../logger')
const Project = require('../models/projects')
const Studies = require('../models/studies')
const Comments = require('../models/comment')
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

//create study
router.post('/createtask', auth, async(req, res) => {
 try {
    const tasks = new Tasks({
        dateCreated: Date.now(),
        createdBy: req.body.user,
        lastUpdated: Date.now(),
        updatedBy: req.body.user,
        tasksTitle: req.body.title,
        tasksDescription: req.body.description,
        assignee: req.body.assignee,
        assigneeName: req.body.assigneeName,
        status: "ONGOING",
        studyName: req.body.studyName,
        projectName: req.body.projectName,
        deadline: req.body.deadline,
        active: true
    })
    const doesExist = await Tasks.findOne({tasksTitle: req.body.title, studyName: req.body.studyName, status: true})
    if(doesExist){
        res.status(400).json({message: "Task title already exist!"})
    } else{
        const newTask =  await tasks.save()
        let completed = await Tasks.find({"studyName": req.body.studyName, "status": "COMPLETED", "active": true})
        let allTask =  await Tasks.find({"studyName": req.body.studyName, "active": true})
        let progress = Math.floor((completed.length/allTask.length)*100)
        Studies.findOneAndUpdate({"studyTitle": req.body.studyName}, {"progress": progress, "status": "ONGOING"}, function(err, studies){
            if(err){
                logger.log('error', 'Error: /createTask, study')
            }
        })
        let  completedStudy =  await Studies.find({"projectName": req.body.projectName, "active": true, "status": "COMPLETED"})
        let allStudy = await Studies.find({"projectName": req.body.projectName, "active": true})
        let progressProject = Math.floor((completedStudy.length/allStudy.length)*100)
        Project.findOneAndUpdate({"projectName": req.body.projectName}, {"progress": progressProject, "status": progressProject===100? "COMPLETED" : "ONGOING"}, function(err, studies){
            if(err){
                logger.log('error', 'Error: /createTask- project')
        }
        })
        res.status(201).json({
            message: 'Task successfully created',
            newTask: newTask
        })
    }
 } catch (error) {
    logger.log('error', 'Error: /createTask') 
    res.status(400).json({message: error.message})
 }
})



//get user assigned to the study selected
router.get('/getUserForTask/:study', auth, async(req, res) => {
    try {
       await Studies.find({"studyTitle": req.params.study}, function(err, studies) {
            if(err){
                logger.log('error', 'Error: /getUserForTask')
            } else{
                res.status(201).json({
                    studies: studies
                }) 
            }
          });
        
    } catch (error) {
        logger.log('error', 'Error: /getUserForTask')
    }
})



//get all task for the study (user)
router.get('/getAllTask/:studyName/:assignee', auth, async(req, res) => {
    try {
      await Tasks.find({ "studyName": req.params.studyName, "active": true}, function(err, tasks){
            if(err){
                logger.log('error', 'Error: /getAllTask')
            }else{
                res.status(201).json({
                    tasks: tasks
                })  
            }
        }) 
    } catch (error) {
        logger.log('error', 'Error: /getAllTask')
    }
})

//get all task for the study (manager)
router.get('/getAllTaskManager/:studyName', auth, async(req, res) => {
    try {
      await Tasks.find({"studyName": req.params.studyName, "active": true}, function(err, tasks){
            if(err){
                logger.log('error', 'Error: /getAllTaskManager')
            }else{
                res.status(201).json({
                    tasks: tasks
                })  
            }
        }) 
    } catch (error) {
        logger.log('error', 'Error: /getAllTaskManager')
    }
})


//comments

//add comment
router.post('/postComment', auth, async(req, res) => {
    try { 
    const comment = new Comments({
        comment: req.body.comment.value,
        user: req.body.comment.author,
        dateCreated: Date.now(),
        avatar: req.body.comment.avatar,
        taskId: req.body.taskID
    })  
        const newComment =  await comment.save()
        Studies.updateOne({"studyID": req.body.studyID}, {"updatedBy": req.body.comment.author}, function(err){
            if(err){
                logger.log('error', 'Error: /postComment')
            }else{
                res.status(201).json({
                    newComment
                })
            }
        })
    } catch (error) {
        logger.log('error', 'Error: /postComment')
    }
})

//display comments
router.get('/getAllComment/:taskId', auth, async(req, res) => {
    try {
        Comments.find({"taskId": req.params.taskId}, function(err, comments){
            if(err){
                logger.log('error', 'Error: /getAllComment')
            }else{
                res.status(201).json({
                    comments
                })  
            }
        }) 
    } catch (error) {
        logger.log('error', 'Error: /getAllComment')
    }
})

//manager update task
router.post('/onUpdateTask', auth, async(req, res) => {
    try {
        let status = req.body.progress === 100 ? "COMPLETED": "ONGOING"
       await Tasks.findOneAndUpdate({"_id": req.body.taskId}, {"status": req.body.status},async function(err, task){
            if(err){
                logger.log('error', 'Error: /onUpdateTAsk')
            }else{
                Studies.findOneAndUpdate({"studyID": req.body.study}, {"progress": req.body.progress, "dateUpdated": Date.now() , "status": status}, async function(err, study){
                    if(err){
                        logger.log('error', 'Error: /onUpdateTask')
                    }
                })
                let  completedStudy =  await Studies.find({"projectName": req.body.projectName, "active": true, "status": "COMPLETED"})
                let allStudy = await Studies.find({"projectName": req.body.projectName, "active": true})
                let progressProject = Math.floor((completedStudy.length/allStudy.length)*100)
                Project.findOneAndUpdate({"projectName": req.body.projectName}, {"progress": progressProject, "status": progressProject===100? "COMPLETED" : "ONGOING"}, function(err, studies){
                    if(err){
                        logger.log('error', 'Error: /onUpdateTask')
                }
                })
                res.status(201).json({
                    task,
                    message: 'Task Updated!'
                })  
            
            }
        }) 
    } catch (error) {
        logger.log('error', error)
    }
})


router.post('/onUpdateTaskUser', auth, async(req, res) => {
    try {
       await Tasks.findOneAndUpdate({"_id": req.body.taskId}, {"status": req.body.status,"dateUpdated": Date.now()},function(err, task){
            if(err){
                logger.log('error', 'Error: /onUpdateTaskUser')
            }else{
                res.status(201).json({
                    task,
                    message: 'Task Submitted!'
                })  
            }
        }) 
    } catch (error) {
        logger.log('error', 'Error: /onUpdateTaskUser')
    }
})

//delete task
router.post('/onDeleteTask', auth, async(req, res) => {
    try {
       await Tasks.findOneAndUpdate({"_id": req.body.taskId}, {"active": false,"deletedDate": Date.now(), 'deletedBy': req.body.user}, async function(err, task){
            if(err){
                logger.log('error', 'Error: /onDeleteTask')
            }else{
                let studyName = task.studyName
                let completed = await Tasks.find({"studyName": studyName, "status": "COMPLETED", "active": true})
                let allTask =  await Tasks.find({"studyName": studyName, "active": true})
                let progressStudy = Math.floor((completed.length/allTask.length)*100)
                Studies.findOneAndUpdate({"studyTitle": studyName}, {"progress": progressStudy, "status": "ONGOING"}, function(err, studies){
                    if(err){
                        logger.log('error', 'Error: /onDeleteTask')
                    }
                })
                let  completedStudy =  await Studies.find({"projectName": req.body.projectName, "active": true, "status": "COMPLETED"})
                let allStudy = await Studies.find({"projectName": req.body.projectName, "active": true})
                let progressProject = Math.floor((completedStudy.length/allStudy.length)*100)
                Project.findOneAndUpdate({"projectName": req.body.projectName}, {"progress": progressProject, "status": progressProject===100? "COMPLETED" : "ONGOING"}, function(err, studies){
                    if(err){
                        logger.log('error', 'Error: /onDeleteTask')
                }
                })
                res.status(201).json({
                    task,
                    message: 'Task Deleted!'
                })
            }
        }) 
    } catch (error) {
        logger.log('error', 'Error: /onDeleteTask')
    }
})
module.exports = router