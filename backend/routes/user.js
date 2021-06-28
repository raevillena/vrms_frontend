const express = require('express')
const router = express.Router()
const User = require('../models/user')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require ('bcrypt');
var generator = require('generate-password');
var nodemailer = require('nodemailer');

//create user
router.route('/secretcreateuser').post(async (req, res) => {
    var password = generator.generate({
        length: 10,
        numbers: true
    });
    console.log(password)
    const users = new User({
        name: req.body.name,
        email: req.body.email,
        project: req.body.project,
        title: req.body.title,
        password: password
    })
    try{   
    const doesExist = await User.findOne({email: users.email})
    if (doesExist){
        console.log("email taken")
        res.status(400).json("Email already taken")
    }else{
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'mmsuvrms@gmail.com',
              pass: 'lalalililolo98765'
            }
          });
          var mailOptions = {
            from: 'mmsuvrms@gmail.com',
            to: users.email,
            subject: 'VRMS ACCOUNT',
            text: 'You can login in Mariano Marcos State University Virtual Research Management System with your email using this password:' + users.password
          };
          console.log
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        const newUser =  await users.save()
        console.log(newUser)
         res.status(201).json(newUser)
        } 
    } catch(err){
         res.status(400).json({message: err.message})
    }
 })


 //update password
 router.post('/updatepassword', async(req, res) => {
     try {
        console.log(req.body.id)
        const user = await User.findOne({_id: req.body.id}) 
        console.log(user)
        if(!user){
            res.status(401).json({message: "User not found"})
        }else{
            let valid = await bcrypt.compare(req.body.oldPass, user.password)
            if(valid)
            {
                let salt = await bcrypt.genSalt(10)
                let hashedPassword = await bcrypt.hash(req.body.newPass, salt)
                User.updateOne({_id: user.id}, {password: hashedPassword}, (err, res) =>{
                    if (err) {
                        console.log(err)
                    }else{
                    console.log("Updated")
                    }
                })
            }else{
                res.status(401).json({message: "Invalid password"})
                console.log("invalid password")
            }
        }
     } catch (error) {
        res.status(500).json({message: error.message})
     }
 })


 router.post('/forgotPassword', async(req, res) => {
  try {
    console.log(req.body.email)
    const user = await User.findOne({email: req.body.email})  
    if(!user){
        res.status(403).json({message: "User not found"})
    }else{
            let salt = await bcrypt.genSalt(10)
            let hashedPassword = await bcrypt.hash(req.body.newPass, salt)
            User.updateOne({_id: user.id}, {password: hashedPassword}, (err, res) =>{
                if (err) {
                    console.log(err)
                }else{
                console.log("Updated")
                }
            })
    }
  } catch (error) {
    res.status(500).json({message: error.message})  
  }
})





module.exports = router