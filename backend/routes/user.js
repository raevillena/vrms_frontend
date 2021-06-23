const express = require('express')
const router = express.Router()
const User = require('../models/user')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require ('bcrypt');

//create user
router.route('/secretcreateuser').post(async (req, res) => {
    const users = new User({
        name: req.body.name,
        email: req.body.email,
        project: req.body.project,
        title: req.body.title,
        password: req.body.password
    })
    try{   
    const doesExist = await User.findOne({email: users.email})
    if (doesExist){
        console.log("email taken")
        res.send("Email already taken")
    }else{
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
            res.status(403).json({message: "User not found"})
        }else{
            console.log(req.body.oldPass)
            let valid = await bcrypt.compare(req.body.oldPass, user.password)
            if(valid)
            {
                console.log("herename")
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
                console.log("invalid password")
            }
        }
     } catch (error) {
        res.status(500).json({message: error.message})
     }
 })




 //getone specific user
 router.get('/',getUser, (req, res) =>{
    res.json(User)
})

//Getting all
router.get('/', async (req, res) => {
    try{
        const user = await User.find()
        res.status(200).json(user)
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

//middleware
async function getUser(req, res, next){
    let users
    try{
        console.log(req.body)
        let id = (req.body.id)
        users = await User.findById(id)
        if(users === null){
            res.status(404).json({message: 'Cannot find user'})
        }
        res.status(200).json(users)
    } catch(err){
        return res.status(500).json({message: err.message})
    }

   res.users = users
   next()
}


module.exports = router