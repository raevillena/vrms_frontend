const express = require('express')
const User = require('../models/user')
const router = express.Router()
const mongoose = require('mongoose')

const jwt = require('jsonwebtoken')


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
    const newUser =  await users.save()
    console.log(newUser)
         res.status(201).json(newUser)
    } catch(err){
         res.status(400).json({message: err.message})
    }
 })


 //
router.post('/updatepassword', (req,res) => {
    try {
        
    } catch (error) {
        
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