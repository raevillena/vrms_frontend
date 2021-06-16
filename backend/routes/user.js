const express = require('express')
const User = require('../models/user')
const router = express.Router()
const mongoose = require('mongoose')

const jwt = require('jsonwebtoken')





//Getting all
router.get('/', async (req, res) => {
    try{
        const user = await User.find()
        res.status(200).json(user)
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

//login





//create user
router.route('/').post(async (req, res) => {
    const users = new User({
        name: req.body.name,
        email: req.body.email,
        project: req.body.project,
        title: req.body.title,
        password: req.body.password
    })
    try{   
    const newUser =  await users.save()
         res.status(201).json(newUser)
    } catch(err){
         res.status(400).json({message: err.message})
    }
 })

 //getone specific user
 router.get('/:id',getUser, (req, res) =>{
    res.json(User)
})

//middleware
async function getUser(req, res, next){
    let users
    try{
        let id = mongoose.Types.ObjectId(req.params.id)
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