const express = require('express')
const router = express.Router()
const Tasks = require('../models/tasks')
const logger = require('../logger')
const Project = require('../models/projects')
const Studies = require('../models/studies')
const Comments = require('../models/comment')
const TasksFile = require('../models/tasksfile')
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
        createdByName: req.body.username,
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
        objective: req.body.objective,
        verification: req.body.verification,
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
        Studies.findOneAndUpdate({"studyID": req.body.studyName}, {"progress": progress, "status": "ONGOING"}, function(err, studies){
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
       await Studies.find({"studyID": req.params.study}, function(err, studies) {
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
router.get('/getAllTask/:studyName/:assignee/:objective', auth, async(req, res) => {
    try {
      await Tasks.find({ "studyName": req.params.studyName, "assignee": req.params.assignee, "objective": req.params.objective, "active": true}, function(err, tasks){
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
router.get('/getAllTaskManager/:studyName/:objective', auth, async(req, res) => {
    try {
      await Tasks.find({"studyName": req.params.studyName,"objective": req.params.objective, "active": true}, function(err, tasks){
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
    console.log(req.body)
    try { 
    const comment = new Comments({
        comment: req.body.comment.value,
        user: req.body.comment.author,
        dateCreated: Date.now(),
        avatar: req.body.comment.avatar,
        taskId: req.body.taskID
    })  
        const newComment =  await comment.save()
        console.log(newComment)
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
       await Tasks.findOneAndUpdate({"_id": req.body.taskId}, {"status": req.body.status},async function(err, tasks){
            if(err){
                logger.log('error', 'Error: /onUpdateTask, findone')
            }else{
                console.log('Task updated!')
            }
        }) 
            let  completedTask =  await Tasks.find({"studyName": req.body.study, "active": true, "status": "COMPLETED"})
                let allTask = await Tasks.find({"studyName": req.body.study, "active": true})
                let progressTask = Math.floor((completedTask.length/allTask.length)*100)
                let status = progressTask === 100 ? "COMPLETED": "ONGOING"
                Studies.findOneAndUpdate({"studyID": req.body.study}, {"progress": progressTask, "dateUpdated": Date.now() , "status": status}, async function(err, study){
                    if(err){
                        logger.log('error', 'Error: /onUpdateTask, studies')
                    }else{
                        console.log('Study updated!')
                    }
                })
                let  completedStudy =  await Studies.find({"projectName": req.body.projectID, "active": true, "status": "COMPLETED"})
                let allStudy = await Studies.find({"projectName": req.body.projectID, "active": true})
                let progressProject = Math.floor((completedStudy.length/allStudy.length)*100)
                Project.findOneAndUpdate({"projectID": req.body.projectID}, {"progress": progressProject, "status": progressProject===100? "COMPLETED" : "ONGOING"}, function(err, studies){
                    if(err){
                        logger.log('error', 'Error: /onUpdateTask, project')
                }else{
                    console.log('Project updated!')
                    res.status(201).json({
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
                let studyID = task.studyName
                let completed = await Tasks.find({"studyName": studyID, "status": "COMPLETED", "active": true})
                let allTask =  await Tasks.find({"studyName": studyID, "active": true})
                let progressStudy = Math.floor((completed.length/allTask.length)*100)
                Studies.findOneAndUpdate({"studyID": studyID}, {"progress": progressStudy, "status": "ONGOING"}, function(err, studies){
                    if(err){
                        logger.log('error', 'Error: /onDeleteTask')
                    }
                })
                let  completedStudy =  await Studies.find({"projectName": req.body.projectName, "active": true, "status": "COMPLETED"})
                let allStudy = await Studies.find({"projectName": req.body.projectName, "active": true})
                let progressProject = Math.floor((completedStudy.length/allStudy.length)*100)
                Project.findOneAndUpdate({"projectID": req.body.projectName}, {"progress": progressProject, "status": progressProject===100? "COMPLETED" : "ONGOING"}, function(err, studies){
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

//get file list
router.get('/getFileList/:taskId', auth, async(req, res) => {
    try {
        TasksFile.find({"taskID": req.params.taskId, 'active': true}, function(err, tasksfile){
            if(err){
                logger.log('error', 'Error: /getFileList')
            }else{
                res.status(201).json({
                    tasksfile
                })  
            }
        }) 
    } catch (error) {
        logger.log('error', 'Error: /getFileList')
    }
})

router.get('/getManagerFile/:id', auth, async(req, res) => {
    try {
        Tasks.find({"studyName": req.params.id, 'active': true}, function(err, tasks){
            if(err){
                logger.log('error', 'Error: /getFileList')
            }else{
                res.status(201).json({
                    tasks
                })  
            }
        }) 
    } catch (error) {
        logger.log('error', 'Error: /getManagerFile')
    }
})

router.get('/getTaskProductivity', auth, async(req, res) => {
    try {
        Tasks.find({'active': true}, function(err, tasks){
            if(err){
                logger.log('error', 'Error: /getFileList')
            }else{
                res.status(201).json({
                    tasks
                })  
            }
        }) 
    } catch (error) {
        logger.log('error', 'Error: /getManagerFile')
    }
})

router.get('/getUserTaskProductivity/:assignee', auth, async(req, res) => {
    try {
        Tasks.find({'active': true, 'assignee': req.params.assignee}, function(err, tasks){
            if(err){
                logger.log('error', 'Error: /getUserTaskProductivity')
            }else{
                res.status(201).json({
                    tasks
                })  
            }
        }) 
    } catch (error) {
        logger.log('error', 'Error: /getUserTaskProductivity')
    }
})

//get all assigned task for user
router.get('/getAllTaskMonitoring/:assignee', auth, async(req, res) => {
    try {
        Tasks.find({'active': true, 'assignee': req.params.assignee}, function(err, tasks){
            if(err){
                logger.log('error', 'Error: /getAllTaskMonitoring')
            }else{
                res.status(201).json({
                    tasks
                })  
            }
        }) 
    } catch (error) {
        logger.log('error', 'Error: /getAllTaskMonitoring')
    }
})

//get tasks cretaed by manager
router.get('/getTaskManager/:creator', auth, async(req, res) => {
    try {
        Tasks.find({'active': true, 'createdBy': req.params.creator}, function(err, tasks){
            if(err){
                logger.log('error', 'Error: /getTaskManager')
            }else{
                res.status(201).json({
                    tasks
                })  
            }
        }) 
    } catch (error) {
        logger.log('error', 'Error: /getTaskManager')
    }
})
module.exports = router