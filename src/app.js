import express from 'express'
import http from 'http'
import { createSession } from './services/sessionService.js'
//import { Server } from 'socket.io'
import routerPosts from './routes/posts.js'
import routerUsers from './routes/users.js'
import routerChats from './routes/chats.js'
import routerStatic from './routes/static.js'
import routerStaticAuth from './routes/staticAutorized.js'
import * as dotenv from 'dotenv'
import morgan from 'morgan'
import { CSRFGuard } from './middleware/antiCsrf.js'
import {pictureUploadGuard} from './services/picture-service.js'
dotenv.config()

const app = express()
const morganMiddleware = morgan('tiny')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(createSession())
app.use(morganMiddleware)
app.use(pictureUploadGuard)
app.use(CSRFGuard)
app.use(routerUsers)
app.use(routerPosts)
app.use(routerChats)
app.use(routerStatic)
app.use(routerStaticAuth)

const server = http.createServer(app)
//const io = new Server(server)

//io.on('connection', (_socket) => {
//Maybe don't send the entire room, since it sends the entire chatlog as well
/*
    socket.on('sendMessage', (room, message, receiverId) => {
        //Send a message to the correct chatroom
        socket.to(room.id).emit('messageReceived', message)
        //Inform user that their message has been sent
        socket.emit('messageSent', message)
        //Send the roomId to notify the recipient user, let the other user realtime information about new notifications
        socket.to(receiverId).emit('newNotification', room.id)
    })


    socket.on('joinRoom', (room) => {
        socket.join(room.id)
    })

    //Event should be called something else
    socket.on('triggerNotifications', (user) => {
        socket.join(user.id)
    })*/
//})

const PORT = process.env.PORT || 8080

server.listen(PORT, (err) => {
    err ? console.log(err) : console.log('App runs on port: ', Number(PORT))
})
