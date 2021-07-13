const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require('path')
const User = require('./models/user')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, __dirname + '/uploads/avatar')
  },
  filename: function (req, file, cb) {
      cb(null, Math.random() * 1000 + file.originalname)
  }
});

var upload = multer({storage: storage})

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

  module.exports = router

  