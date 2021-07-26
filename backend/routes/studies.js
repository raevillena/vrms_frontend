const express = require('express')
const router = express.Router()
const Studies = require('../models/studies')
const Datagrid = require('../models/datagrid')
const mongoose = require('mongoose')
const shortid = require('shortid')
const logger = require('../logger')

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
        logger.log('error', error)  
        res.status(400).json({message: error.message})
    }
})


//finding assignee study for each user
router.post('/getStudyForUser', async(req, res) => {
    try {
     Studies.find({"assignee": req.body.name}, function(err, studies) {
            if(err){
                logger.log('error', error)
            } else{
                res.send(studies)
            }
          });
    } catch (error) {
        logger.log('error', error)
    }
})


//updating the datagrid in database
router.post('/addDatagrid', async(req, res) => {
    const newDatagrid = new Datagrid({
        dateCreated: Date.now(),
        createdBy: req.body.user,
        dateUpdated: Date.now(),
        updatedBy: req.body.user,
        title: req.body.title,
        description: req.body.description,
        data: req.body.data,
        columns: req.body.columns,
        studyID: req.body.studyID,
        active: true
    })
    try {
       const doesExist = await Datagrid.findOne({title: req.body.title, studyID: req.body.studyID, active:true}) //status
       if(doesExist){
        res.status(201).json({message: "Title already exist!"}) 
       }else{
        Studies.updateOne({studyID: req.body.studyID}, {dateUpdated: Date.now()}, async (err) =>{
            if(err){
                console.log("Unable to update study data!")
            }else{
                await newDatagrid.save()
                console.log("Study data updated!")
                res.status(200).json({data: newDatagrid, message: "Table saved!"})
            }
        })
       }
    } catch (error) {
        logger.log('error', error)
    }
})

//getting the data of datagrid to display on table
router.post('/getDataGrid', async(req, res) => {
    console.log('get data grid')
    console.log(req.body)
    try {
        Datagrid.find({"studyID": req.body.studyID, "active": true}, function(err, grid) {
            if(err){
                logger.log('error', error)
            } else{
                console.log("grid",grid)
                res.send(grid)
            }
          });
    } catch (error) {
        console.log("error happened here", error)
        logger.log('error', error)
    }
})

//edit datagrid
router.post('/editDataGrid', async(req, res) => {
    try {
        Datagrid.find({"_id": req.body._id, "active": true}, function(err, grid) {
            if(err){
                logger.log('error', error)
            } else{
                console.log("grid",grid)
                res.send(grid)
            }
          });
    } catch (error) {
        console.log("error happened here", error)
        logger.log('error', error)
    }
})

//delete datagrid/table
router.post('/deleteDataGrid', async(req, res) => {
    try {
        Datagrid.findOneAndUpdate({"_id": req.body._id}, {"active": false}, function(err) {
            if(err){
                logger.log('error', error)
            } else{
                console.log("grid status change")
                res.send("Item Deleted!")
            }
          });
    } catch (error) {
        console.log("error happened here", error)
        logger.log('error', error)
    }
})

//update datagrid/table
router.post('/updateDataGrid', async(req, res) => {
    console.log('updating datagrid')
    try {
        Datagrid.updateOne({title: req.body.title, studyID: req.body.studyID, active:true}, {data: req.body.data, title: req.body.title, description: req.body.description, dateUpdated: Date.now(), updatedBy: req.body.user}, (err) =>{
            if (err) {
              console.log(err)
            }else{
                Studies.updateOne({studyID: req.body.studyID}, {dateUpdated: Date.now()}, (err) =>{
                    if(err){
                        console.log("Unable to update study data!")
                    }else{
                        console.log("Study data updated!")
                    }
                })
              console.log("data Updated")
            }
          })
    } catch (error) {
        console.log("error happened here", error)
        logger.log('error', error)
    }
})

module.exports = router