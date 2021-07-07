const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require('path')
const User = require('../models/user')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, __dirname + '/uploads/avatar')
  },
  filename: function (req, file, cb) {
      // You could rename the file name
      // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))

      // You could use the original name
      cb(null, Math.random() * 1000 + file.originalname)
  }
});

var upload = multer({storage: storage})

router.post("/avatar", upload.single("file"), async (req, res, next) => {
  try {
    console.log(req.file)
    console.log(req.body.user)
    await User.updateOne({_id: req.body.user}, {avatar: req.file.path}, (err) =>{
      if (err) {
        console.log(err)
      }else{
        console.log("path updated")
      }
    })
    return res.status(200).json({
      message: "submitted successfully",
  });
  } catch (error) {
    res.status(500).json({message: error.message})
  }
});


  module.exports = router