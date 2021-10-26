const express = require('express')
const router = express.Router()
const Studies = require('../models/studies')
const Datagrid = require('../models/datagrid')
const Projects = require('../models/projects')
const Download = require('../models/download')
const Editlog = require('../models/editlog')
const Viewlog = require('../models/viewlog')
const Documentation = require('../models/documentation')
const mongoose = require('mongoose')
const shortid = require('shortid')
const logger = require('../logger')
const jwt = require('jsonwebtoken')
const Gallery = require('../models/gallery')

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
router.post('/createstudy', auth, async(req, res) => {
    try {
    const studyID = shortid.generate() 
    const study = new Studies({
        dateCreated: Date.now(),
        createdBy: req.body.study.user,
        dateUpdated: Date.now(),
        startDate: req.body.study.startDate,
        updatedBy: req.body.study.user,
        studyTitle: req.body.study.title,
        studyID: studyID,
        assignee: req.body.study.assignee,
        assigneeName: req.body.study.assigneeName,
        status: "ONGOING",
        progress: 0,
        projectName: req.body.study.projectName,
        deadline: req.body.study.deadline,
        budget: req.body.study.budget,
        objectives: req.body.values.objectives,
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
            if(progress === 100){
                Projects.findOneAndUpdate({"projectName": req.body.projectName,"active": true}, {"progress": progress, "status": "COMPLETED"}, function(err, proj){
                    if(err){
                        logger.log('error', err)
                    }
                })
            }
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
router.get('/getStudyForUser/:assignee', auth , async(req, res) => {
    try {
    await Studies.find({"assignee": req.params.assignee}, function(err, studies) {
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
router.get('/getStudyforDoc/:studyID', auth, async(req, res) => {
    try {
    await Studies.find({"studyID": req.params.studyID}, function(err, study) {
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
router.post('/updateSummary', auth,  async(req, res) => {
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
router.post('/updateIntroduction', auth,  async(req, res) => {
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

router.post('/updateMethodology', auth, async(req, res) => {
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

router.post('/updateResultsAndDiscussion', auth, async(req, res) => {
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

router.post('/updateConclusion', auth, async(req, res) => {
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
router.get('/getDocumentation/:studyID', auth, async(req, res) => {
    try {
       await Documentation.findOne({"studyID": req.params.studyID}, function(err, docs) {
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
router.post('/addDatagrid', auth, async(req, res) => {
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
router.get('/getDataGrid/:studyID', auth, async(req, res) => {
    try {
       await  Datagrid.find({"studyID": req.params.studyID, "active": true}, function(err, grid) {
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
router.get('/editDataGrid/:tableID', auth, async(req, res) => {

    try {
      await  Datagrid.find({"tableID": req.params.tableID, "active": true}, function(err, grid) {
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
router.post('/deleteDataGrid', auth, async(req, res) => {
    try {
      await  Datagrid.findOneAndUpdate({"_id": req.body._id}, {"active": false, "deletedDate": Date.now(), 'deletedBy': req.body.user}, function(err) {
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
router.post('/updateDataGrid', auth, async(req, res) => {
    try {
      await  Datagrid.updateOne({title: req.body.title, studyID: req.body.studyID, active:true}, {data: req.body.data, title: req.body.title, description: req.body.description, columns: req.body.columns, dateUpdated: Date.now(), updatedBy: req.body.user}, async(err) =>{
            if (err) {
                logger.log('error', 'Error: /updateDatagrid')
            }else{
              await  Studies.findOneAndUpdate({studyID: req.body.studyID}, {dateUpdated: Date.now(), updatedBy: req.body.user}, (err, study) =>{
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
router.post('/downloadHistory', auth,  async(req, res) => {
    try {
    const download = new Download({
        downloadDate: Date.now(),
        downloadedBy: req.body.user,
        tableID: req.body.id.tableID
    })
    await download.save()
    res.status(200).json({ message: "Download Recorded"})
    } catch (error) {
        logger.log('error', `Error: /downloadHistory - ${error}`) 
        res.status(400).json({message: error.message})
    }
})

//edit log
router.post('/editlog', auth,  async(req, res) => {
    try {
    const edit = new Editlog({
        editDate: Date.now(),
        editedBy: req.body.user,
        tableID: req.body.id
    })
    await edit.save()
    res.status(200).json({ message: "Edit Recorded"})
    } catch (error) {
        logger.log('error', `Error: /editlog - ${error}`) 
        res.status(400).json({message: error.message})
    }
})

//get download history
router.get('/getdownloadHistory/:tableID', auth,  async(req, res) => {
    try {
    Download.find({"tableID": req.params.tableID}, function(err, history){
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

//get edit history
router.get('/getEditlog/:tableID', auth,  async(req, res) => {
    try {
    Editlog.find({"tableID": req.params.tableID}, function(err, history){
        if(err){
            logger.log('error', 'Error: /getEditlog')
        }
        res.status(200).json({
            history: history
        })
    })
    } catch (error) {
        logger.log('error', 'Error: /getEditlog') 
        res.status(400).json({message: error.message})
    }
})

//study for project
router.get('/studyForProject/:projectName', auth, async(req, res) => {
    try {
        await Studies.find({"projectName": req.params.projectName, "active": true}, function(err, projects) {
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
router.post("/deleteStudy", auth, async(req,res) => {
    try {
      await Studies.findOneAndUpdate({"_id": req.body._id},{"active": false, "deletedDate": Date.now(), 'deletedBy': req.body.user}, function(err, study) {
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

//get gallery
router.get('/studyGallery/:studyID', auth, async(req, res) => {
    try {
        await Gallery.find({"studyID": req.params.studyID}, function(err, gallery) {
            if(err){
                logger.log('error', 'Error: /studyGallery')
            } else{
                res.send(gallery)
            }
          });
    } catch (error) {
        logger.log('error', 'Error: /studyGallery')
    }
})

//duplicate study
router.get('/getStudyCol/:studyID', auth, async(req, res) => {
    try {
        await Datagrid.find({"studyID": req.params.studyID, "active": true}, function(err, datagrid) {
            if(err){
                logger.log('error', 'Error: /getStudyCol')
            } else{
                res.send(datagrid)
            }
          });
    } catch (error) {
        logger.log('error', 'Error: /getStudyCol')
    }
})

router.post('/updateCurrentEditing', auth, async(req, res) => {
    try {
        await Datagrid.findOneAndUpdate({"tableID": req.body.tableID, "active": true}, {"currentEditingAvatar": req.body.avatar, "currentEditingName": req.body.username}, function(err, datagrid) {
            if(err){
                logger.log('error', 'Error: /updateCurrentEditing')
            } else{
                res.send(datagrid)
            }
          });
    } catch (error) {
        logger.log('error', 'Error: /updateCurrentEditing')
    }
})

router.get('/getCurrentEditing/:tableID', auth, async(req, res) => {
    try {
        await Datagrid.find({"tableID": req.params.tableID, "active": true}, function(err, user) {
            if(err){
                logger.log('error', 'Error: /getCurrentEditing')
            } else{
                res.send(user)
            }
          });
    } catch (error) {
        logger.log('error', 'Error: /getCurrentEditing')
    }
})

//view log
router.post('/viewlog', auth,  async(req, res) => {

    try {
    const view = new Viewlog({
        viewDate: Date.now(),
        viewBy: req.body.user,
        tableID: req.body.id
    })
    await view.save()
    res.status(200).json({ message: "View Recorded"})
    } catch (error) {
        logger.log('error', `Error: /viewlog - ${error}`) 
        res.status(400).json({message: error.message})
    }
})

router.get('/getViewlog/:tableID', auth,  async(req, res) => {
    try {
    Viewlog.find({"tableID": req.params.tableID}, function(err, history){
        if(err){
            logger.log('error', 'Error: /getViewlog')
        }
        res.status(200).json({
            history: history
        })
    })
    } catch (error) {
        logger.log('error', 'Error: /getViewlog') 
        res.status(400).json({message: error.message})
    }
})

router.post('/updateStudy', auth, async(req, res) => {
    try {
        await Studies.findOneAndUpdate({"studyID": req.body.study.studyID, "active": true}, {'editedBy': req.body.study.user, 'editedDate': Date.now(), 
        'assignee':req.body.study.assignee, 'assigneeName': req.body.study.assigneeName, 'budget': req.body.study.budget, 'deadline': req.body.study.deadline, 'studyTitle': req.body.study.title,
        'objectives': req.body.value.objectives}, 
        function(err, study) {
            if(err){
                logger.log('error', 'Error: /updateCurrentEditing')
            } else{
                res.send({message: "Study Updated"})
            }
          });
    } catch (error) {
        logger.log('error', 'Error: /updateCurrentEditing')
    }
})


router.get("/getAllStudy", async(req,res) => {
    try {
       Studies.find({active: true}, function(err, studies) {
        res.send(studies);  
      });
    } catch (error) {
      logger.log('error', 'Get all project error!')  
    }
  })

module.exports = router