require('dotenv').config()
//rae updating update
const express =require('express')
const app = express()
const mongoose = require('mongoose')
const bodyparser = require("body-parser")



mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true}).catch(err => console.log(err));
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

const io = require("socket.io")(3002, {
    cors: {
        origin: "http://nberic.org", 
        methods: ["GET", "POST"]
    }
})


io.on("connection", socket => {
    console.log('connected to socket.io')

    socket.on("join-table", data => {    
        console.log('room', data.room)    
        socket.join(data.room)
        const count = io.sockets.adapter.rooms.get(data.room).size
        if(count == 1){
            socket.emit(data.room, "allow-edit")
        }
        else{
            socket.emit(data.room, "view-only")
        }
    })

    socket.on("send-changes-columns", editorState => { //chnges in columns
        socket.in(editorState.room).emit('receive-columns', editorState)
    })

    socket.on("send-changes-columns-delete", state => { //changes in columns during delete
        console.log(state.data)
        socket.in(state.room).emit("receive-columns-delete", state.data)
    })

    socket.on("send-changes", editorState => { //changes in data
        socket.to(editorState.room).emit("receive-datagrid", editorState.data)
    })
    
    socket.on("disconnect", () => console.log("Client disconnected"));
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))
const userRouter =  require('./routes/user')
const authRouter =  require('./routes/auth')
const uploadRouter = require('./upload')
const projectRouter = require('./routes/project')
const studiesRouter =  require('./routes/studies')
const tasksRouter =  require('./routes/tasks')
const logger = require('./logger')

app.use('/v1/upload', uploadRouter)
app.use('/v1/user', userRouter)
app.use('/v1/auth', authRouter)
app.use('/v1/project', projectRouter)
app.use('/v1/studies',studiesRouter)
app.use('/v1/tasks',tasksRouter)


app.listen(3001, () => logger.log('info', 'server started at port: 3001'))
