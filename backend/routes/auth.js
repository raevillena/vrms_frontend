const express = require('express')
const User = require('../models/user')
const router = express.Router()

const Token = require('../models/token')
const jwt = require('jsonwebtoken')




//login
router.post('/login', async (req, res) => {
    try{
        if (!req.body.email || !req.body.password) {
            res.status(403).json({message: "Mali ka"}) 
        }

        const user = await User.findOne({email: req.body.email , password:req.body.password })
        if (user === null) {
            res.status(403).json({message: "No User"})  
        }
        const accessDuration = '1300';
        const refreshDuration = '3600'
        let accessToken = await jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: accessDuration})
        let refreshToken = await jwt.sign({user}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: refreshDuration})        
        
        const token = new Token({
            id: user.id,
            refreshToken: refreshToken,
            refreshDuration: refreshDuration,
            isActive: true
        });
        const newToken =  await token.save()

         res.status(201).json({accessToken, refreshToken}) 
    }catch(err){
        res.status(500).json({message: err.message})
    }
})



//get dashboard
router.post('/dash', async (req, res) =>{
    const token = req.header('Authorization')
    console.log(token)

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

//middleware(verify token)









module.exports = router