require('dotenv').config()

const express =require('express')
const app = express()
const mongoose = require('mongoose')
const user = require('./models/user')
const router = require('./routes/user')
const bodyparser = require("body-parser")


mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true}).catch(err => console.log(err));
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

app.use(express.json())
app.use(express.urlencoded())
const userRouter =  require('./routes/user')
const authRouter =  require('./routes/auth')

app.use('/v1/user', userRouter)
app.use('/v1/auth', authRouter)


app.listen(3001, () => console.log('server started'))