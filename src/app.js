import express from 'express'
import http from 'http'
import { createSession } from './middleware/sessionService.js'
import routerPosts from './routes/posts.js'
import routerUsers from './routes/users.js'
import routerChats from './routes/chats.js'
import routerStatic from './routes/static.js'
import routerStaticAuth from './routes/staticAutorized.js'
import * as dotenv from 'dotenv'
import morgan from 'morgan'
import { CSRFGuard } from './middleware/antiCsrf.js'
import helmet from 'helmet'
import * as bodyParser from 'express'
import { pictureUploadGuard } from './services/picture-service.js'
import { preventXss } from './middleware/anitXss.js'

dotenv.config()

const app = express()
const morganMiddleware = morgan('tiny')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
app.use(helmet())
app.use(express.static('public'))
app.use(createSession())
app.use(morganMiddleware)
app.get('/healthz', (req, res) => {
    res.sendStatus(200)
})
app.use(pictureUploadGuard)
app.use(CSRFGuard)
app.use(preventXss)
app.use(routerUsers)
app.use(routerPosts)
app.use(routerChats)
app.use(routerStatic)
app.use(routerStaticAuth)

const server = http.createServer(app)
server.headersTimeout = 5000
server.requestTimeout = 10000

const PORT = process.env.PORT || 8080

server.listen(PORT, (err) => {
    err ? console.log(err) : console.log('App runs on port: ', Number(PORT))
})
