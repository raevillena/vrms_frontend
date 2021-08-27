const express = require('express')
const router = express.Router()
const Studies = require('../models/studies')
const Datagrid = require('../models/datagrid')
const Documentation = require('../models/documentation')
const mongoose = require('mongoose')
const shortid = require('shortid')
const logger = require('../logger')
var HtmlDocx = require('html-docx-js');
var fs = require('fs')

//create study
router.post('/createstudy', async(req, res) => {
    try {
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
        deadline: req.body.deadline,
        budget: req.body.budget
    })
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


//finding assigned study for each user
router.post('/getStudyForUser', async(req, res) => {
    try {
    await Studies.find({"assignee": req.body.name}, function(err, studies) {
            if(err){
                logger.log('error', error)
            } else{
                res.send(studies)
            }
          });
    } catch (error) {
        logger.log('error', error)
        res.status(400).json({message: error.message})
    }
})

//find specific study for documentation
router.post('/getStudyforDoc', async(req, res) => {
    try {
    await Studies.find({"studyID": req.body.studyID}, function(err, study) {
            if(err){
                logger.log('error', err)
            } else{
                res.send({study})
            }
          });
    } catch (error) {
        logger.log('error', error)
        res.status(400).json({message: error.message})
    }
})

//updating the summary for documentation
router.post('/updateSummary', async(req, res) => {
    try {
     await Studies.findOneAndUpdate({"studyID": req.body.studyID} , {"summary": req.body.summary, "updatedBy": req.body.user}, function(err, study) {
            if(err){
                console.log(err)
                logger.log('error', err)
            } else{
                res.send({study})
            }
          });
    } catch (error) {
        logger.log('error', error)
        res.status(400).json({message: error.message})
    }
})


//updating documentation intro/methodology/results and conclusion
router.post('/updateIntroduction', async(req, res) => {
    try {
       const doesExist = await Documentation.findOne({"studyID": req.body.studyID})
        if(doesExist){
            Documentation.updateOne({"studyID": req.body.studyID}, {"introduction": req.body.introduction},
             function(err, docs){
                if(err){
                    console.log('inside',err)
                    logger.log('error', err)
                }else{
                    Studies.updateOne({"studyID": req.body.studyID}, {"updatedBy": req.body.user}, function(err){
                        if(err){
                            logger.log('error', err)
                        }else{
                            res.send({docs})
                        }
                    })
                }
            })
        }else{
            const document = new Documentation({
                introduction: req.body.introduction,
                studyID: req.body.studyID
            })
            const newDoc =  await document.save()
            Studies.updateOne({"studyID": req.body.studyID}, {"updatedBy": req.body.user}, function(err){
                if(err){
                    logger.log('error', err)
                }else{
                    res.send({newDoc})
                }
            })
        }
    } catch (error) {
        logger.log('error', error)
        res.status(400).json({message: error.message})
    }
})

router.post('/updateMethodology', async(req, res) => {
    try {
       const doesExist = await Documentation.findOne({"studyID": req.body.studyID})
        if(doesExist){
            Documentation.updateOne({"studyID": req.body.studyID}, {"methodology": req.body.methodology},
             function(err, docs){
                if(err){
                    console.log(err)
                    logger.log('error', err)
                }else{
                    Studies.updateOne({"studyID": req.body.studyID}, {"updatedBy": req.body.user}, function(err){
                        if(err){
                            logger.log('error', err)
                        }else{
                            res.send({docs})
                        }
                    })
                }
            })
        }else{
            const document = new Documentation({
                methodology: req.body.methodology,
                studyID: req.body.studyID   
            })
            const newDoc =  await document.save()
            Studies.updateOne({"studyID": req.body.studyID}, {"updatedBy": req.body.user}, function(err){
                if(err){
                    logger.log('error', err)
                }else{
                    res.send({newDoc})
                }
            })
        }
    } catch (error) {
        logger.log('error', error)
        res.status(400).json({message: error.message})
    }
})

router.post('/updateResultsAndDiscussion', async(req, res) => {
    try {
       const doesExist = await Documentation.findOne({"studyID": req.body.studyID})
        if(doesExist){
            Documentation.updateOne({"studyID": req.body.studyID}, {"resultsAndDiscussion": req.body.resultsAndDiscussion},
             function(err, docs){
                if(err){
                    console.log(err)
                    logger.log('error', err)
                }else{
                    Studies.updateOne({"studyID": req.body.studyID}, {"updatedBy": req.body.user}, function(err){
                        if(err){
                            logger.log('error', err)
                        }else{
                            res.send({docs})
                        }
                    })
                }
            })
        }else{
            const document = new Documentation({
                resultsAndDiscussion: req.body.resultsAndDiscussion,
                studyID: req.body.studyID
            })
            const newDoc =  await document.save()
            Studies.updateOne({"studyID": req.body.studyID}, {"updatedBy": req.body.user}, function(err){
                if(err){
                    logger.log('error', err)
                }else{
                    res.send({newDoc})
                }
            })
        }
    } catch (error) {
        logger.log('error', error)
        res.status(400).json({message: error.message})
    }
})

router.post('/updateConclusion', async(req, res) => {
    try {
       const doesExist = await Documentation.findOne({"studyID": req.body.studyID})
        if(doesExist){
            Documentation.updateOne({"studyID": req.body.studyID}, {"conclusion": req.body.conclusion},
             function(err, docs){
                if(err){
                    console.log(err)
                    logger.log('error', err)
                }else{
                    Studies.updateOne({"studyID": req.body.studyID}, {"updatedBy": req.body.user}, function(err){
                        if(err){
                            logger.log('error', err)
                        }else{
                            res.send({docs})
                        }
                    })
                }
            })
        }else{
            const document = new Documentation({
                conclusion: req.body.conclusion,
                studyID: req.body.studyID
            })
            const newDoc =  await document.save()
            Studies.updateOne({"studyID": req.body.studyID}, {"updatedBy": req.body.user}, function(err){
                if(err){
                    logger.log('error', err)
                }else{
                    res.send({newDoc})
                }
            })
        }
    } catch (error) {
        logger.log('error', error)
        res.status(400).json({message: error.message})
    }
})

//get data for documentation
router.post('/getDocumentation', async(req, res) => {
    try {
       await Documentation.findOne({"studyID": req.body.studyID}, function(err, docs) {
               if(err){
                   logger.log('error', err)
               } else{
                   res.send({docs})
               }
             });
       } catch (error) {
           logger.log('error', error)
           res.status(400).json({message: error.message})
       }
})

//updating the datagrid in database
router.post('/addDatagrid', async(req, res) => {
    try {
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
       const doesExist = await Datagrid.findOne({title: req.body.title, studyID: req.body.studyID, active:true}) //status
       if(doesExist){
        res.status(201).json({message: "Title already exist!"}) 
       }else{
        Studies.updateOne({"studyID": req.body.studyID}, {"dateUpdated": Date.now(), "updatedBy": req.body.user}, async (err) =>{
            if(err){
                console.log("Unable to update study data!")
            }else{
                await newDatagrid.save()
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
    try {
       await  Datagrid.find({"studyID": req.body.studyID, "active": true}, function(err, grid) {
            if(err){
                logger.log('error', error)
            } else{
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
      await  Datagrid.find({"_id": req.body._id, "active": true}, function(err, grid) {
            if(err){
                logger.log('error', error)
            } else{
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
      await  Datagrid.findOneAndUpdate({"_id": req.body._id}, {"active": false}, function(err) {
            if(err){
                logger.log('error', error)
            } else{
                Studies.updateOne({studyID: req.body.studyID}, {dateUpdated: Date.now(), updatedBy: req.body.user}, (err) =>{
                    if(err){
                        console.log("Unable to update study data!")
                    }else{
                        res.send("Item Deleted!")
                    }
                })
            }
          });
    } catch (error) {
        console.log("error happened here", error)
        logger.log('error', error)
    }
})

//update datagrid/table
router.post('/updateDataGrid', async(req, res) => {
    try {
      await  Datagrid.updateOne({title: req.body.title, studyID: req.body.studyID, active:true}, {data: req.body.data, title: req.body.title, description: req.body.description, columns: req.body.columns, dateUpdated: Date.now(), updatedBy: req.body.user}, async(err) =>{
            if (err) {
              console.log(err)
            }else{
              await  Studies.updateOne({studyID: req.body.studyID}, {dateUpdated: Date.now(), updatedBy: req.body.user}, (err) =>{
                    if(err){
                        logger.log('error', "unable to update study -update datagrid")
                    }else{
                        console.log("Study data updated!")
                    }
                })
            }
          })
    } catch (error) {
        console.log("error happened here", error)
        logger.log('error', error)
    }
})

module.exports = router