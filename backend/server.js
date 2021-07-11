require('dotenv').config()

const express =require('express')
const app = express()
const mongoose = require('mongoose')
const bodyparser = require("body-parser")



mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true}).catch(err => console.log(err));
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))


app.use(express.json())
app.use(express.urlencoded({extended: true}))
const userRouter =  require('./routes/user')
const authRouter =  require('./routes/auth')
const uploadRouter = require('./upload')
const projectRouter = require('./routes/project')
const studiesRouter =  require('./routes/studies')
const logger = require('./logger')

app.use('/v1/upload', uploadRouter)
app.use('/v1/user', userRouter)
app.use('/v1/auth', authRouter)
app.use('/v1/project', projectRouter)
app.use('/v1/studies',studiesRouter)


app.listen(3001, () => logger.log('info', 'server started at port: 3001'))