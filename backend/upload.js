const express = require("express")
const router = express.Router()
const multer = require("multer")
const User = require('./models/user')
const Gallery = require('./models/gallery')
const TasksFile = require('./models/tasksfile')
const OfflineGallery = require('./models/offlinegallery')
 const logger = require('./logger')
 const jwt = require('jsonwebtoken')




const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, __dirname + '/uploads/avatar')
  },
  filename: function (req, file, cb) {
      cb(null, Math.random() * 1000 + file.originalname)
  }, 
  limits: { fileSize: 1 * 1000 * 1000 }
});

const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, __dirname + '/uploads/datagrid')
  },
  filename: function (req, file, cb) {
      cb(null, Math.random() * 1000 + file.originalname)
  },
  limits: { fileSize: 1 * 1000 * 1000 }
});

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, __dirname + '/uploads/documentation')
  },
  filename: function (req, file, cb) {
      cb(null, Math.random() * 1000 + file.originalname)
  },
  limits: { fileSize: 1 * 1000 * 1000 }
});

const storage3 = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, __dirname + '/uploads/gallery')
  },
  filename: function (req, file, cb) {
      cb(null, Math.random() * 1000 + file.originalname)
  },
  limits: { fileSize: 1 * 1000 * 1000 }
});

const storage4 = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, __dirname + '/uploads/tasks')
  },
  filename: function (req, file, cb) {
      cb(null, Math.random() * 1000 + file.originalname)
  },
});

const storage5 = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, __dirname + '/uploads/offline')
  },
  filename: function (req, file, cb) {
      cb(null, Math.random() * 1000 + file.originalname)
  },
  limits: { fileSize: 1 * 1000 * 1000 }
});



var upload = multer({storage: storage})
var upload1 = multer({storage: storage1})
var upload2 = multer({storage: storage2})
var upload3 = multer({storage: storage3})
var upload4 = multer({storage: storage4})
var upload5 = multer({storage: storage5})


router.post("/avatar", upload.single("file"), async (req, res, next) => {
  try {
    await User.updateOne({_id: req.body.user}, {avatarFilename: req.file.filename}, (err) =>{
      if (err) {
        logger.log('error', err)
      }
    })
    const user = await User.findOne({_id: req.body.user})
    return res.status(201).json({
      message: "submitted successfully",
      user
    });
  } catch (error) {
    logger.log('error', error)
    res.status(500).json({message: error.message})
  }
});


router.post("/datagrid", upload1.single("file"), async (req, res, next) => {
  try {
    const filename = req.file.filename
    return res.status(201).json({
      message: "Upload successful",
      filename
    });
  } catch (error) {
    logger.log('error', error)
    res.status(500).json({message: error.message})
  }
});

router.post("/documentation", upload2.single("file"), async (req, res, next) => {
  try {
    const filename = req.file.filename
   if(!req.file) {
    res.send({
        status: false,
        message: 'No file uploaded'
    })}
    return res.status(201).json({
      status: true,
      filename,
      message: "Upload successful",
    });
  } catch (error) {
    logger.log('error', error)
    res.status(500).json({message: error.message})
  }
});


router.post("/gallery", upload3.single("file"), async (req, res, next) => {
  try {
      const gallery = new Gallery({
        studyID: req.body.study,
        images: req.file.filename,
        caption: req.body.caption,
        active: true
      })
      const newGallery =  await gallery.save()
      res.status(201).json({
        message: `Image sucessfully uploaded!`,
        newGallery
      })
  } catch (error) {
    logger.log('error', error)
    res.status(500).json({message: error.message})
  }
});


router.post("/tasksfile", upload4.single("file"), async (req, res, next) => {
  try {
      const taskfile = new TasksFile({
        taskID: req.body.task,
        file: req.file.filename,
        description: req.body.description,
        uploadedByID: req.body.userID,
        uploadedByName: req.body.userName,
        uploadDate: Date.now(),
        active: true
      })
      const newFile =  await taskfile.save()
      res.status(201).json({
        message: `File sucessfully uploaded!`,
        newFile
      })
  } catch (error) {
    logger.log('error', error)
    res.status(500).json({message: error.message})
  }
});

router.post("/postofflinegallery", upload5.single("file"), async (req, res, next) => {
  try {
      const gallery = new OfflineGallery({
        images: req.file.filename,
        caption: req.body.caption,
        user: req.body.user,
        active: true
      })
      const newGallery =  await gallery.save()
      res.status(201).json({
        message: `Image sucessfully uploaded!`,
        newGallery
      })
  } catch (error) {
    logger.log('error', error)
    res.status(500).json({message: error.message})
  }
});


router.get('/downloadFileTask/:file', function(req, res, next) {
  const file = `${__dirname}/uploads/tasks/${req.params.file}`;
  res.download(file, req.params.file);
});
 module.exports = router

  