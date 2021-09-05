const express = require('express')
const router = express.Router()
const Studies = require('../models/studies')
const Datagrid = require('../models/datagrid')
const Projects = require('../models/projects')
const Download = require('../models/download')
const Documentation = require('../models/documentation')
const mongoose = require('mongoose')
const shortid = require('shortid')
const logger = require('../logger')
var HtmlDocx = require('html-docx-js');
var fs = require('fs')
const { message } = require('antd')

//create study
router.post('/createstudy', async(req, res) => {
    try {
    const studyID = shortid.generate() 
    const study = new Studies({
        dateCreated: Date.now(),
        createdBy: req.body.user,
        dateUpdated: Date.now(),
        updatedBy: req.body.user,
        studyTitle: req.body.title,
        studyID: studyID,
        assignee: req.body.assignee,
        status: "ONGOING",
        progress: 0,
        projectName: req.body.projectName,
        deadline: req.body.deadline,
        budget: req.body.budget,
        active: true
    })
        const doesExist = await Studies.findOne({studyTitle: req.body.title})
        if(doesExist){
            res.status(400).json({message: "Study title already exist!"})
        } else{
            const newStudy =  await study.save()
            let completed = await Studies.find({"projectName": req.body.projectName, "status": "COMPLETED", "active": true})
            let allTask =  await Studies.find({"projectName": req.body.projectName, "active": true})
            let progress = Math.floor((completed.length/allTask.length)*100)
            Projects.findOneAndUpdate({"projectName": req.body.projectName,"active": true}, {"progress": progress, "status": "ONGOING"}, function(err, proj){
                if(err){
                    logger.log('error', err)
                }
            })
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
     await Studies.findOneAndUpdate({"studyID": req.body.studyID} , {"summary": req.body.summary, "updatedBy": req.body.user, "studyTitle": req.body.title, "budget": req.body.budget}, function(err, study) {
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


//updating documentation intro/methodology/results and conclusion
router.post('/updateIntroduction', async(req, res) => {
    try {
       const doesExist = await Documentation.findOne({"studyID": req.body.studyID})
        if(doesExist){
            Documentation.updateOne({"studyID": req.body.studyID}, {"introduction": req.body.introduction},
             function(err, docs){
                if(err){
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
                   logger.log('error', 'Error: /getDocumentation')
               } else{
                   res.send({docs})
               }
             });
       } catch (error) {
            logger.log('error', 'Error: /getDocumentation')
           res.status(400).json({message: error.message})
       }
})

//updating the datagrid in database
router.post('/addDatagrid', async(req, res) => {
    try {
        const id = shortid.generate() 
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
            active: true,
           tableID: id
        })
       const doesExist = await Datagrid.findOne({title: req.body.title, studyID: req.body.studyID, active:true}) //status
       if(doesExist){
        res.status(201).json({message: "Title already exist!"}) 
       }else{
        Studies.updateOne({"studyID": req.body.studyID}, {"dateUpdated": Date.now(), "updatedBy": req.body.user}, async (err) =>{
            if(err){
                logger.log('error', 'Error: /addDatagrid')
            }else{
               await newDatagrid.save()
                res.status(200).json({data: newDatagrid, message: "Table saved!"})
            }
        })
       }
    } catch (error) {
        logger.log('error', 'Error: /addDatagrid')
    }
})

//getting the data of datagrid to display on table
router.post('/getDataGrid', async(req, res) => {
    try {
       await  Datagrid.find({"studyID": req.body.studyID, "active": true}, function(err, grid) {
            if(err){
                logger.log('error', 'Error: /getDatagrid')
            } else{
                res.send(grid)
            }
          });
    } catch (error) {
        logger.log('error', 'Error: /getDatagrid')
    }
})

//edit datagrid
router.post('/editDataGrid', async(req, res) => {
    try {
      await  Datagrid.find({"tableID": req.body.tableID, "active": true}, function(err, grid) {
            if(err){
                logger.log('error', 'Error: /editDatagrid')
            } else{
                res.send(grid)
            }
          });
    } catch (error) {
        logger.log('error', 'Error: /editDatagrid')
    }
})

//delete datagrid/table
router.post('/deleteDataGrid', async(req, res) => {
    try {
      await  Datagrid.findOneAndUpdate({"_id": req.body._id}, {"active": false}, function(err) {
            if(err){
                logger.log('error', 'Error: /deleteDatagrid')
            } else{
                Studies.updateOne({studyID: req.body.studyID}, {dateUpdated: Date.now(), updatedBy: req.body.user}, (err) =>{
                    if(err){
                        logger.log('error', 'Error: /deleteDatagrid')
                    }else{
                        res.send("Item Deleted!")
                    }
                })
            }
          });
    } catch (error) {
        logger.log('error', 'Error: /deleteDatagrid')
    }
})

//update datagrid/table
router.post('/updateDataGrid', async(req, res) => {
    try {
      await  Datagrid.updateOne({title: req.body.title, studyID: req.body.studyID, active:true}, {data: req.body.data, title: req.body.title, description: req.body.description, columns: req.body.columns, dateUpdated: Date.now(), updatedBy: req.body.user}, async(err) =>{
            if (err) {
                logger.log('error', 'Error: /updateDatagrid')
            }else{
              await  Studies.updateOne({studyID: req.body.studyID}, {dateUpdated: Date.now(), updatedBy: req.body.user}, (err) =>{
                    if(err){
                        logger.log('error', 'Error: /updateDatagrid')
                    }
                    res.send({message: "Data updated!"})
                })
            }
          })
    } catch (error) {
        logger.log('error', 'Error: /updateDatagrid')
    }
})

//download history 
router.post('/downloadHistory', async(req, res) => {
    try {
    const download = new Download({
        downloadDate: Date.now(),
        downloadedBy: req.body.user,
        tableID: req.body.tableID
    })
    await download.save()
    res.status(200).json({ message: "Download Recorded"})
    } catch (error) {
        logger.log('error', 'Error: /downloadHistory') 
        res.status(400).json({message: error.message})
    }
})

//get download history
router.post('/getdownloadHistory', async(req, res) => {
    try {
    Download.find({"tableID": req.body.tableID}, function(err, history){
        if(err){
            logger.log('error', 'Error: /getdownloadhistory')
        }
        res.status(200).json({
            history: history
        })
    })
    } catch (error) {
        logger.log('error', 'Error: /getdownloadhistory') 
        res.status(400).json({message: error.message})
    }
})

//study for project
router.post('/studyForProject', async(req, res) => {
    try {
        await Studies.find({"projectName": req.body.projectName, "active": true}, function(err, projects) {
            if(err){
                logger.log('error', 'Error: /studyForProject')
            } else{
                res.send(projects)
            }
          });
    } catch (error) {
        logger.log('error', 'Error: /studyForProject')
    }
})


//delete study
router.post("/deleteStudy", async(req,res) => {
    console.log(req.body)
    try {
      await Studies.findOneAndUpdate({"_id": req.body._id},{"active": false}, function(err, study) {
        if(err){
            logger.log('error', 'Project delete')
        } else{
            res.send({message: "Deleted!"})
        }
      });
    } catch (error) {
      logger.log('error', 'Studies delete error')  
    }
  })

module.exports = router