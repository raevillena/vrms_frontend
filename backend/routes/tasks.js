const express = require('express')
const router = express.Router()
const Tasks = require('../models/tasks')
const mongoose = require('mongoose')
const logger = require('../logger')
const Project = require('../models/projects')
const Studies = require('../models/studies')
const Comments = require('../models/comment')


//create study
router.post('/createtask', async(req, res) => {
 try {
    const tasks = new Tasks({
        dateCreated: Date.now(),
        createdBy: "test",
        lastUpdated: Date.now(),
        updatedBy: "test",
        tasksTitle: req.body.title,
        tasksDescription: req.body.description,
        assignee: req.body.assignee,
        status: "ONGOING",
        studyName: req.body.studyName,
        projectName: req.body.projectName,
        deadline: req.body.deadline
    })
    const doesExist = await Tasks.findOne({tasksTitle: req.body.title, studyID: req.body.studyID, status: true})
    if(doesExist){
        console.log("Task Title already taken")
        res.status(400).json({message: "Task title already exist!"})
    } else{
        const newTask =  await tasks.save()
        console.log(newTask)
        res.status(201).json({
            message: 'Task successfully created',
            newTask: newTask
        })
    }
 } catch (error) {
    logger.log('error', error)  
    res.status(400).json({message: error.message})
 }
})


//get all study for add task
router.post('/getStudyForTask', async(req, res) => {
    try {
     let doesExist = await Project.find({"projectName": req.body.projectName});
     if(doesExist){
        Studies.find({"projectName": req.body.projectName, }, function(err, studies) {
            if(err){
                logger.log('error', err)
            } else{
                console.log(studies)
                res.status(201).json({
                    studies: studies
                }) 
            }
          });
     }     
    } catch (error) {
        logger.log('error', error)
    }
})

//get user assigned to the study selected
router.post('/getUserForTask', async(req, res) => {
    try {
       await Studies.find({"studyTitle": req.body.study}, function(err, studies) {
            if(err){
                logger.log('error', err)
            } else{
                console.log(studies)
                res.status(201).json({
                    studies: studies
                }) 
            }
          });
        
    } catch (error) {
        logger.log('error', error)
    }
})



//get all task for the study
router.post('/getAllTask', async(req, res) => {
    try {
      await Tasks.find({"assignee": req.body.assignee, "studyName": req.body.studyName}, function(err, tasks){
            if(err){
                logger.log('error', err)
            }else{
                res.status(201).json({
                    tasks: tasks
                })  
            }
        }) 
    } catch (error) {
        logger.log('error', error)
    }
})


//comments

//add comment
router.post('/postComment', async(req, res) => {
    try { 
        console.log(req.body)
    const comment = new Comments({
        comment: req.body.comment.value,
        user: req.body.comment.author,
        dateCreated: Date.now(),
        avatar: req.body.comment.avatar,
        taskId: req.body.taskID
    })  
        const newComment =  await comment.save()
        console.log(newComment)
        res.status(201).json({
            newComment
        })
    } catch (error) {
        console.log(error)
        logger.log('error', error)
    }
})

//display comments
router.post('/getAllComment', async(req, res) => {
    try {
        Comments.find({"taskId": req.body.taskId}, function(err, comments){
            if(err){
                logger.log('error', err)
                console.log(err)
            }else{
                res.status(201).json({
                    comments
                })  
            }
        }) 
    } catch (error) {
        console.log(error)
        logger.log('error', error)
    }
})
module.exports = router