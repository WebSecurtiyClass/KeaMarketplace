import express from 'express'
import userService from '../services/userService.js'
import email from '../services/email.js'
import { v4 as uuidv4 } from 'uuid'
import rateLimit from 'express-rate-limit'
import { getCsrfToken } from '../middleware/antiCsrf.js'

const rateLimitAuth = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
})

const routerUsers = express.Router()
routerUsers.post('/api/login', rateLimitAuth, (req, res) => {
    const ipAddress = req.socket.remoteAddress
    console.log(ipAddress)
    userService.userValidation({ ...req.body }).then((serviceResponse) => {
        if (serviceResponse && serviceResponse.status === 'approve') {
            //can store any other data from the db to the seasion
            req.session.userId = serviceResponse.id
            req.session.role = serviceResponse.role
            res.redirect('/')
        } else {
            res.redirect('/login')
        }
    })
})

routerUsers.post('/api/signup', rateLimitAuth, (req, res) => {
    console.log('api/signup called with: ', req.body)
    const confirmationCode = uuidv4()
    const signUpInfo = {
        ...req.body,
        status: 'pending',
        confirmationCode: confirmationCode,
    }
    const password = req.body.password
    // This is pure copy from stackoverflow, and we have no clue what it is
    const emailRegex = new RegExp(
        '(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])'
    )
    const passwordRegex = new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$'
    )
    let checks
    try {
        checks = [
            // TODO: include in the end before hand-in
            passwordRegex.test(password),
            signUpInfo.firstName.length > 1,
            signUpInfo.lastName.length > 1,
            emailRegex.test(signUpInfo.email),
            signUpInfo.password.length > 7,
        ]
    } catch (e) {
        res.redirect('/signup/failed')
    }
    if (!checks.includes(false)) {
        email.emailConfirmation(req, confirmationCode)
        userService.signUp(signUpInfo).then((result) => {
            if (result) {
                res.redirect('/signup/complete')
            } else {
                res.redirect('/signup/failed')
            }
        })
    } else {
        res.redirect('/signup/failed')
    }
})

routerUsers.post('/api/confirm', (req, res) => {
    console.log(req.body)
    userService.userValidation({ ...req.body }).then((serviceResponse) => {
        if (serviceResponse.confirmationCode === req.body.code) {
            //change user status
            userService.approveEmailAddress(serviceResponse.id)
            //remove code
            //login
            req.session.role = serviceResponse.role
            req.session.userId = serviceResponse.id
            res.redirect('/')
        } else {
            res.redirect('/confirm/' + req.body.code)
        }
    })
})

routerUsers.all('/api/users/*', (req, res, next) => {
    console.log(req.session)
    if (!req.session.userId) {
        res.sendStatus(401)
    } else {
        next()
    }
})

routerUsers.get('/api/users/profile', (req, res) => {
    userService
        .getUsers(req.session.userId)
        .then((result) => res.send({ user: result }))
})
routerUsers.get('/api/users/:id', (req, res) => {
    userService
        .getUsers(req.params.id)
        .then((result) => res.send({ user: result }))
})

routerUsers.put('/api/users/notifications', (req, res) => {
    userService
        .deleteNotification(req.body.roomId, req.body.type, req.session.userId)
        .then((result) => res.send(result))
})

routerUsers.post('/api/users/notifications', (req, res) => {
    userService
        .saveNotification(req.body.roomId, req.body.type, req.body.receiverId)
        .then((result) => res.send(result))
})

routerUsers.get('/api/csrf-token', async (req, res) => {
    const token = await getCsrfToken(req.session.userId)
    res.json({ csrfToken: token })
})

export default routerUsers
