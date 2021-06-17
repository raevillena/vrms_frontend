const express = require('express')
const Token = require('../models/token')
const User = require('../models/user')
const router = express.Router()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

//LOGIN
router.post('/login', async (req, res) => {
    try{

        if (!req.body.email || !req.body.password) {
            res.status(403).json({message: "Maling ka"})
        }

        const user = await User.findOne({email: req.body.email , password:req.body.password })
        if (user === null) {
            res.status(403).json({message: "Mali ka again"})
        }
        const accessDuration = '1300';
        const refreshDuration = '3600'
        let accessToken = await jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: accessDuration})
        let refreshToken = await jwt.sign({user}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: refreshDuration})        
        
        const token = new Token({
            id: user.id,
            refreshToken: refreshToken,
            refreshTokenDuration: refreshDuration,
            isActive: true
        })
        token.save()
        res.status(200).json({data: user, token: token, accessToken})
    }catch(err){
        res.status(500).json({message: err.message})
    }
})

router.post('/verify', auth, async (req, res) =>{
    try {
        res.status(200).json({status: true})
    } catch (error) {
        res.status(500).json({message: err.message})
    }
})

//middleware

async function auth(req, res, next){
   try {
    let token = req.header('Authorization')
    token = token.split(" ")[1]

    jwt.verify(token,  process.env.ACCESS_TOKEN_SECRET , async(err, user) => {
        if (user){
            req.user = user
            next()
        } else if(err.message == "jwt expired"){
            return res.json ({
                success: false,
                message: "Access Token Expired"
            })
        } else{
            return res
            .status(403)
            .json({err, message: "User not Authenticated"})
        }
    })
   } catch(error) {
        next(error)
   } 
}


module.exports = router