const express = require("express")
const router = express.Router()
const multer = require("multer")
const User = require('./models/user')
 const logger = require('./logger')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, __dirname + '/uploads/avatar')
  },
  filename: function (req, file, cb) {
      cb(null, Math.random() * 1000 + file.originalname)
  }
});

const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, __dirname + '/uploads/datagrid')
  },
  filename: function (req, file, cb) {
      cb(null, Math.random() * 1000 + file.originalname)
  }
});

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, __dirname + '/uploads/documentation')
  },
  filename: function (req, file, cb) {
      cb(null, Math.random() * 1000 + file.originalname)
  }
});

var upload = multer({storage: storage})
var upload1 = multer({storage: storage1})
var upload2 = multer({storage: storage2})

router.post("/avatar", upload.single("file"), async (req, res, next) => {
  try {
    console.log(req.file)
    await User.updateOne({_id: req.body.user}, {avatarFilename: req.file.filename}, (err) =>{
      if (err) {
        logger.log('error', err)
      }else{
        console.log("filename updated")
      }
    })
    const user = await User.findOne({_id: req.body.user})
    console.log(user)
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
    console.log('file', req.file.filename)
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
    //console.log('file', req.file)
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
    console.log('error', error)
    res.status(500).json({message: error.message})
  }
});


 module.exports = router

  