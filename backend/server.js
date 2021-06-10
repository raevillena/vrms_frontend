require('dotenv').config()

const express =require('express')
const app = express()
const mongoose = require('mongoose')
const user = require('./models/user')

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))


app.use(express.json())

const userRouter =  require('./routes/user')
app.use('/user', userRouter)

app.listen(3001, () => console.log('server started'))