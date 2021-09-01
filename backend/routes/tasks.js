const express = require('express')
const router = express.Router()
const Tasks = require('../models/tasks')
const logger = require('../logger')
const Project = require('../models/projects')
const Studies = require('../models/studies')
const Comments = require('../models/comment')



//create study
router.post('/createtask', async(req, res) => {
 try {
    const tasks = new Tasks({
        dateCreated: Date.now(),
        createdBy: req.body.user,
        lastUpdated: Date.now(),
        updatedBy: req.body.user,
        tasksTitle: req.body.title,
        tasksDescription: req.body.description,
        assignee: req.body.assignee,
        status: "ONGOING",
        studyName: req.body.studyName,
        projectName: req.body.projectName,
        deadline: req.body.deadline,
        active: true
    })
    const doesExist = await Tasks.findOne({tasksTitle: req.body.title, studyName: req.body.studyName, status: true})
    if(doesExist){
        console.log("Task Title already taken")
        res.status(400).json({message: "Task title already exist!"})
    } else{
        const newTask =  await tasks.save()
        console.log(newTask)
        let completed = await Tasks.find({"studyName": req.body.studyName, "status": "COMPLETED", "active": true})
        let allTask =  await Tasks.find({"studyName": req.body.studyName, "active": true})
        let progress = Math.floor((completed.length/allTask.length)*100)
        Studies.findOneAndUpdate({"studyTitle": req.body.studyName}, {"progress": progress, "status": "ONGOING"}, function(err, studies){
            if(err){
                logger.log('error', 'Error: /createTask, study')
                console.log(err)
            }
            console.log('studies', studies)
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
router.post('/getUserForTask', async(req, res) => {
    try {
       await Studies.find({"studyTitle": req.body.study}, function(err, studies) {
            if(err){
                logger.log('error', 'Error: /getUserForTask')
            } else{
                console.log(studies)
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
router.post('/getAllTask', async(req, res) => {
    try {
      await Tasks.find({"assignee": req.body.assignee, "studyName": req.body.studyName, "active": true}, function(err, tasks){
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
router.post('/getAllTaskManager', async(req, res) => {
    try {
      await Tasks.find({"studyName": req.body.studyName, "active": true}, function(err, tasks){
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
router.post('/postComment', async(req, res) => {
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
        console.log(error)
        logger.log('error', 'Error: /postComment')
    }
})

//display comments
router.post('/getAllComment', async(req, res) => {
    try {
        Comments.find({"taskId": req.body.taskId}, function(err, comments){
            if(err){
                logger.log('error', 'Error: /getAllComment')
                console.log(err)
            }else{
                res.status(201).json({
                    comments
                })  
            }
        }) 
    } catch (error) {
        console.log(error)
        logger.log('error', 'Error: /getAllComment')
    }
})

//manager update task
router.post('/onUpdateTask', async(req, res) => {
    try {
        let status = req.body.progress === 100 ? "COMPLETED": "ONGOING"
        console.log(status, req.body.progress)
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
        console.log(error)
        logger.log('error', error)
    }
})


router.post('/onUpdateTaskUser', async(req, res) => {
    console.log("update user", req.body)
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
        console.log(error)
        logger.log('error', 'Error: /onUpdateTaskUser')
    }
})

//delete task
router.post('/onDeleteTask', async(req, res) => {
    //console.log("delete task", req.body)
    try {
       await Tasks.findOneAndUpdate({"_id": req.body.taskId}, {"active": false,"dateUpdated": Date.now()}, async function(err, task){
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