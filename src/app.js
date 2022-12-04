import { dirname } from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import fs from 'fs'
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
import helmet from 'helmet';

dotenv.config()
const app = express()
const morganMiddleware = morgan('tiny')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(createSession())
app.use(morganMiddleware)
app.use(CSRFGuard)
app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            'connect-src': ['self', 'localhost:3000', 'https://*.fontawesome.com'],
            'default-src': ['localhost:3000', 'https://*.fontawesome.com'],
            'script-src': ['self', 'localhost:3000', 'https://*.fontawesome.com/'],
            'img-src': ['self', 'localhost:3000'],
            'font-src': ['self', 'localhost:3000', 'https://*.fontawesome.com'],
        },
    },
}));
app.use(helmet.xssFilter());
app.use(routerUsers)
app.use(routerPosts)
app.use(routerChats)
app.use(routerStatic)
app.use(routerStaticAuth)

const server = http.createServer(app)
server.headersTimeout = 5000
server.requestTimeout = 10000
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
