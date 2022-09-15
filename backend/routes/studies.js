const express = require('express')
const router = express.Router()
const Studies = require('../models/studies')
const Datagrid = require('../models/datagrid')
const Backup = require('../models/backup')
const Projects = require('../models/projects')
const Download = require('../models/download')
const Editlog = require('../models/editlog')
const Viewlog = require('../models/viewlog')
const Task = require('../models/tasks')
const Documentation = require('../models/documentation')
const mongoose = require('mongoose')
const shortid = require('shortid')
const logger = require('../logger')
const jwt = require('jsonwebtoken')
const Gallery = require('../models/gallery')
const Offline = require('../models/offline')
const OfflineGallery = require('../models/offlinegallery')

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
        createdByName: req.body.study.username,
        dateUpdated: Date.now(),
        startDate: req.body.study.startDate,
        updatedBy: req.body.study.username,
        studyTitle: req.body.study.title,
        studyID: studyID,
        assignee: req.body.study.assignee,
        assigneeName: req.body.study.assigneeName,
        fundingCategory: req.body.study.fundingCategory,
        fundingAgency: req.body.study.fundingAgency,
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
    await Studies.find({"assignee": req.params.assignee, 'active': true}, function(err, studies) {
            if(err){
                logger.log('error', err)
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

router.post('/updateRrl', auth, async(req, res) => {
    try {
       const doesExist = await Documentation.findOne({"studyID": req.body.studyID})
        if(doesExist){
            Documentation.findOneAndUpdate({"studyID": req.body.studyID}, {"rrl": req.body.rrl},
             function(err){
                if(err){
                    logger.log('error', err)
                }else{
                    Studies.findOneAndUpdate({"studyID": req.body.studyID}, {"updatedBy": req.body.user}, function(err){
                        if(err){
                            logger.log('error', err)
                        }else{
                            res.send({message: 'Document Updated!'})
                        }
                    })
                }
            })
        }else{
            const document = new Documentation({
                rrl: req.body.methodology,
                studyID: req.body.studyID   
            })
            const newDoc =  await document.save()
            Studies.updateOne({"studyID": req.body.studyID}, {"updatedBy": req.body.user}, function(err){
                if(err){
                    logger.log('error', err)
                }else{
                    res.send({newDoc, message: 'Document Updated!'})
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
            Documentation.findOneAndUpdate({"studyID": req.body.studyID}, {"resultsAndDiscussion": req.body.resultsAndDiscussion},
             function(err, docs){
                if(err){
                    logger.log('error', err)
                }else{
                    Studies.updateOne({"studyID": req.body.studyID}, {"updatedBy": req.body.user}, function(err){
                        if(err){
                            logger.log('error', err)
                        }else{
                            res.send({message: 'Document Updated!'})
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
    console.log('conclusion', req.body.conclusion)
    try {
       const doesExist = await Documentation.findOne({"studyID": req.body.studyID})
        if(doesExist){
            Documentation.findOneAndUpdate({"studyID": req.body.studyID}, {"conclusion": req.body.conclusion},
             function(err){
                if(err){
                    logger.log('error', err)
                }else{
                    Studies.updateOne({"studyID": req.body.studyID}, {"updatedBy": req.body.user}, function(err){
                        if(err){
                            logger.log('error', err)
                        }else{
                            res.send({message:'Document Updated!'})
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
                    res.send({message:'Document Updated!'})
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

//backup datagrid
router.post('/backupDatagrid', auth, async(req, res) => {
    try {
        const newBackup = new Backup({
            backupDate: Date.now(),
            backupBy: req.body.user,
            title: req.body.title,
            description: req.body.description,
            data: req.body.data,
            columns: req.body.columns,
            studyID: req.body.studyID,
            active: true,
           tableID: req.body.tableID,
           status: 'BACKUP'
        })
       
        await newBackup.save()
    } catch (error) {
        logger.log('error', `Error: /backupDatagrid ${error}`)
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
      await  Datagrid.findOneAndUpdate({'tableID': req.body.id, active:true}, {'data': req.body.data.data, 'title': req.body.data.title, 'description': req.body.data.description, 'columns': req.body.data.columns, 'dateUpdated': Date.now(), 'updatedBy': req.body.data.user}, async(err, edit) =>{
            if (err) {
                logger.log('error', 'Error: /updateDatagrid')
            }else{
              await  Studies.findOneAndUpdate({'studyID': req.body.studyID}, {'dateUpdated': Date.now(), 'updatedBy': req.body.user}, (err, study) =>{
                    if(err){
                        logger.log('error', 'Error: /updateDatagrid')
                    }else{
                        res.send({message: "Data updated!", edit})
                    }
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
        await Gallery.find({"studyID": req.params.studyID, 'active': true}, function(err, gallery) {
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
       Studies.find({}, function(err, studies) {
        res.send(studies);  
      });
    } catch (error) {
      logger.log('error', 'Get all study error!')  
    }
  })

  router.get("/getAllCreatedTable/:user", async(req,res) => {
    try {
       Datagrid.find({'active': true, 'createdBy':  req.params.user }, function(err, table) {
        res.send(table);  
      });
    } catch (error) {
      logger.log('error', 'Get all created table error!')  
    }
  })

  router.get("/getAllStudiesForIndividualPerformance/:assignee", async(req,res) => {
    try {
       Studies.find({'active': true, 'assignee': req.params.assignee}, function(err, studies) {
        res.send(studies);  
      });
    } catch (error) {
      logger.log('error', 'Get all study ip error!')  
    }
  })

  router.get("/getStudyManagerMonitor/:creator", async(req,res) => {
    try {
       Studies.find({'active': true, 'createdBy': req.params.creator}, function(err, studies) {
        res.send(studies);  
      });
    } catch (error) {
      logger.log('error', 'Get all study ip error!')  
    }
  })


  router.get("/getAllDatagridAdmin", async(req,res) => {
    try {
       Datagrid.find({}, function(err, data) {
        res.send(data);  
      });
    } catch (error) {
      logger.log('error', 'Get all study ip error!')  
    }
  })

  router.post('/updateStudyAdmin', auth, async(req, res) => {
    try {
        await Studies.findOneAndUpdate({"studyID": req.body.study.studyID}, {'editedBy': req.body.study.user, 'editedDate': Date.now(), 
        'assignee':req.body.study.assignee, 'assigneeName': req.body.study.assigneeName, 'budget': req.body.study.budget, 'deadline': req.body.study.deadline, 'studyTitle': req.body.study.title,
        'objectives': req.body.value.objectives, 'active': req.body.study.active, 'projectName': req.body.study.projectName, 'progress': req.body.study.progress, 'dateCreated': req.body.study.dateCreated,
        'status': req.body.study.progress === '100' ? 'COMPLETED' : req.body.study.status[0], 'fundingCategory': req.body.fundingCategory, 'fundingAgency': req.body.fundingAgency}, 
        function(err, study) {
            if(err){
                logger.log('error', `Error: /updateStudyAdmin - ${err}`)
            } else{
                res.send({message: "Study Updated"})
            }
          });
    } catch (error) {
        logger.log('error', 'Error: /updateStudyAdmin')
    }
})

router.post('/updateDataGridAdmin', auth, async(req, res) => {
    try {
      await  Datagrid.findOneAndUpdate({'tableID': req.body.id}, {'title': req.body.title, 'description': req.body.description, 'dateUpdated': Date.now(), 'updatedBy': req.body.user, 'active': req.body.active, 'studyID': req.body.studyID}, async(err, edit) =>{
            if (err) {
                logger.log('error', 'Error: /updateDataGridAdmin')
            }else{
              await  Studies.findOneAndUpdate({'studyID': req.body.studyID}, {'dateUpdated': Date.now(), 'updatedBy': req.body.user}, (err, study) =>{
                    if(err){
                        logger.log('error', 'Error: /updateDataGridAdmin')
                    }else{
                        res.send({message: "Table updated!"})
                    }
                })
            }
          })
    } catch (error) {
        logger.log('error', 'Error: /updateDatagrid')
    }
})

router.get('/studyGalleryAdmin', auth, async(req, res) => {
    try {
        await Gallery.find({}, function(err, gallery) {
            if(err){
                logger.log('error', 'Error: /studyGalleryAdmin')
            } else{
                res.send(gallery)
            }
          });
    } catch (error) {
        logger.log('error', 'Error: /studyGalleryAdmin')
    }
})

router.post('/studyGalleryAdminUpdate', auth, async(req, res) => {
    try {
        await Gallery.findOneAndUpdate({'_id': req.body.id}, {'active': req.body.active, 'caption': req.body.caption, 'studyID': req.body.studyID}, function(err, gallery) {
            if(err){
                logger.log('error', 'Error: /studyGalleryAdmin')
            } else{
                res.send({gallery, message: 'Gallery updated!'})
            }
          });
    } catch (error) {
        logger.log('error', 'Error: /studyGalleryAdmin')
    }
})

router.post('/updateObjective', auth, async(req, res) => {
    console.log(req.body)
    try {
          await Task.findOneAndUpdate({'studyName': req.body.studyID, 'objective': req.body.objective}, {'objective': req.body.value}, async function(err, task) {
            if(err){
                logger.log('error', 'Error: /updateObj1')
            }{
                console.log('updated task', task)
            }
          });
          await Studies.findOneAndUpdate({'studyID': req.body.studyID}, {'objectives': req.body.objectives.objectives}, function(err, study) {
            if(err){
                logger.log('error', 'Error: /updateObj2')
            } else{
                res.send({message: 'Objective Updated!'})
            }
          });
    } catch (error) {
        logger.log('error', `Error: /updateObj, ${error}`)
    }
})

router.get('/getAllBackup/', auth, async(req, res) => {
    try {
        await Backup.find({}, function(err, backup) {
            if(err){
                logger.log('error', 'Error: /getAllBackup')
            } else{
                res.send(backup)
            }
          });
    } catch (error) {
        logger.log('error', 'Error: /getAllBackup')
    }
})

router.post('/recoverDatagidData', auth, async(req, res) => {
    try {
        await Datagrid.findOneAndUpdate({'tableID': req.body.tableID}, {'data': req.body.data, 'columns': req.body.columns, 'title': req.body.title, 'description': req.body.description}, function(err, datagrid) {
            if(err){
                logger.log('error', 'Error: /recoverDatagridData')
            } else{
                res.send({message: 'Data Updated!'})
            }
        });
        await Backup.findOneAndUpdate({'_id': req.body.key}, {'status': 'RECOVERED', dateRecovered: Date.now()}, function(err, datagrid) {
            if(err){
                logger.log('error', 'Error: /recoverDatagridData backup')
            } 
        });
    } catch (error) {
        logger.log('error', 'Error: /recoverDatagridData')
    }
})

router.post('/postOffline', auth, async(req, res) => {
    let x = req.body.cookies
    try {
        for (let i = 0; i < x.length; i++) {
        const tableID = shortid.generate() 
        const table = new Offline({
            tableID: tableID,
            title: x[i].title,
            description: x[i].description,
            data: x[i].data,
            columns: x[i].columns,
            active: true,
            dateUploaded: Date.now(),
            dateCreated:x[i].dateCreated,
            uploadedBy: req.body.user
        })
            const doesExist = await Offline.findOne({title: x[i].title})
            if(doesExist){
                res.status(400).json({message: "Title already exist!"})
            } else{
                const newTable =  await table.save()
                res.status(201).json({
                    message: `Table created with the id ${tableID}`,
                newTable})
            }
            
        }
        } catch (error) {
            logger.log('error', error)  
            res.status(400).json({message: error.message})
        }
})

router.get('/getOffline/:user', auth, async(req, res) => {
    try {
        await Offline.find({'uploadedBy': req.params.user, 'active': true}, function(err, data) {
            if(err){
                logger.log('error', 'Error: /getOffline')
            } else{
                res.send(data)
            }
          });
    } catch (error) {
        logger.log('error', 'Error: /getOffline')
    }
})

router.post('/moveOffline', auth, async(req, res) => {
    try {
       let doesExist =  await Datagrid.findOne({title: req.body.title, studyID: req.body.studyID})
       if(doesExist){
           res.send({message: 'Title already exist'})
       }else{
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
            tableID: req.body.tableID
        })
        Studies.updateOne({"studyID": req.body.studyID}, {"dateUpdated": Date.now(), "updatedBy": req.body.user}, async (err) =>{
            if(err){
                logger.log('error', 'Error: /addDatagrid')
            }else{
               await newDatagrid.save()
               Offline.findOneAndUpdate({tableID: req.body.tableID,"active": true}, {active: false}, function(err, off){
                if(err){
                    logger.log('error', err)
                }
            })
                res.status(200).json({data: newDatagrid, message: "Table added!"})
            }
        })
       }
    } catch (error) {
        logger.log('error', 'Error: /moveOffline')
    }  
})

router.post('/deleteOffline', auth, async(req, res) => {
    try {
        Offline.findOneAndUpdate({tableID: req.body.tableID, active: true},{active: false}, function(err, off){
            if(err){
                logger.log('error', err)
            }else{
                res.status(200).json({message: "Table deleted!"})
            }
        })
            
    } catch (error) {
        logger.log('error', 'Error: /deleteOffline')
    }
})

router.get('/getOfflineGallery/:user', auth, async(req, res) => {
    try {
        await OfflineGallery.find({'user': req.params.user, 'active': true}, function(err, data) {
            if(err){
                logger.log('error', 'Error: /getOfflineGallery')
            } else{
                res.send(data)
            }
          });
    } catch (error) {
        logger.log('error', 'Error: /getOfflineGallery')
    }
})

router.post('/deleteOfflineGallery', auth, async(req, res) => {
    try {
        OfflineGallery.findOneAndUpdate({_id: req.body.tableID, active: true},{active: false}, function(err, off){
            if(err){
                logger.log('error', err)
            }else{
                res.status(200).json({message: "Image deleted!"})
            }
        })
            
    } catch (error) {
        logger.log('error', 'Error: /deleteOfflineGallery')
    }
})

router.post('/updateOfflineGallery', auth, async(req, res) => {
    try {
        OfflineGallery.findOneAndUpdate({_id: req.body.id, active: true},{studyID: req.body.studyID, caption: req.body.caption, updatedBy: req.body.user}, function(err, off){
            if(err){
                logger.log('error', err)
            }else{
                res.status(200).json({message: "Updated!"})
            }
        })
            
    } catch (error) {
        logger.log('error', 'Error: /updateOfflineGallery')
    }
})

router.get('/getOfflineGalleryStudy/:study', auth, async(req, res) => {
    try {
        await OfflineGallery.find({'studyID': req.params.study, 'active': true}, function(err, data) {
            if(err){
                logger.log('error', 'Error: /getOfflineGalleryStudy')
            } else{
                res.send(data)
            }
          });
    } catch (error) {
        logger.log('error', 'Error: /getOfflineGalleryStudy')
    }
})
module.exports = router