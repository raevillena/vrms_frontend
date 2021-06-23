const express = require('express')
const Token = require('../models/token')
const User = require('../models/user')
const router = express.Router()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require ('bcrypt');

//LOGIN
router.post('/login', async (req, res) => {
    try{

        if (!req.body.email || !req.body.password) {
            res.status(403).json({message: "Mali"})
        }

        const user = await User.findOne({email: req.body.email})
        if (!user) {
            res.status(403).json({message: "User not found"})
        }
            let valid = await bcrypt.compare(req.body.password, user.password);
                if(valid){
                    const refreshDuration = '18000'
                    const accessToken = await generateAccessToken(user);
                    const refreshToken = await jwt.sign({user}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: refreshDuration})

                const token = new Token({
                    id: user.id,
                    refreshToken: refreshToken,
                    refreshTokenDuration: refreshDuration,
                    isActive: true
                })
                const newToken = await token.save()
        
                res.status(200).json({data: user, token: token, accessToken})
                }else{
                    return res.status(401).json({ error: "Invalid password!" });
                }
    }catch(err){
        return res.status(500).json({ error: "Internal Server Error!" })
        console.log(err)
    }
})

router.post('/verify',auth, async (req, res) =>{
    try {
        res.status(200).json({status: true})
    } catch (error) {
        res.status(500).json({message: err.message})
    }
})


router.post('/renewToken', async (req, res, next) =>{
    try {
        const token = Token.findOne({refreshToken: req.body.refreshToken})
        const refreshToken = token.refreshToken
        console.log(refreshToken)
    
        if (refreshToken == null){
            console.log('error1')
            return res.sendStatus(401)
        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async(err, user) =>{
            if(err){
                console.log(err)
                Token.updateOne({refreshToken: refreshToken}, {isActive: false}, (err, res) =>{
                    if (err) throw err
                    console.log("Updated")
                })
                return res.sendStatus(401).json({err})
            }
            const accessToken = generateAccessToken(user)
            res.status(200).json({accessToken})
        })
    } catch (error) {
        next(error)
    }
    
})

router.post('/logout', (req,res) =>{
    const refreshToken = req.body.refreshToken
    console.log(refreshToken)
    Token.updateOne({refreshToken: refreshToken}, {isActive: false}, (err, res) =>{
        if (err) {
            throw err
        }else{
            console.log("Updated DB")
        }
    })
})
//middleware

async function auth(req, res, next){
   try {
    let token = req.header('Authorization')
    token = token.split(" ")[1]
    
    if(token == null){
        return res.sendStatus(401)
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async(err, payload) => {
      if(err){
          console.log(err)
        return res.sendStatus(401).json({err})
      }
      req.payload =payload
      next()
    })
   } catch(error) {
        next(error)
   } 
}



function generateAccessToken(user){
    return jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '36000'})
}

module.exports = router