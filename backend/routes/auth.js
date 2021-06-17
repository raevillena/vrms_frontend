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

router.post('/dash', async (req, res) =>{
    const token = req.header('Authorization')
    

    if(!token){
        return res.status(401).json({ message: "Auth Error" })
    }
 
    try{
         const decoded = jwt.verify(token, 'secretKey')
         req.user = decoded.user;
         const user = User.findById(decoded.user.id);
         console.log(user)
        
 
    }catch(error){
     if (error.name === "TokenExpiredError") {
         return res
           .status(401)
           .json({ error: "Session timed out,please login again" });
       } else if (error.name === "JsonWebTokenError") {
         return res
           .status(401)
           .json({ error: "Invalid token,please login again!" });
       } else {
         console.error(error);
         return res.status(400).json({ error });
       }
 }
}
)

module.exports = router