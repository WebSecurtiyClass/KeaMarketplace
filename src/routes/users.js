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
    const confirmationCode = uuidv4()
    const signUpInfo = {
        ...req.body,
        status: 'pending',
        confirmationCode: confirmationCode,
    }
    const emailRegex =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    const passwordRegex = new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[-+_!@#$%^&*.,?]).+$'
    )

    let checks = [
        // TODO: include in the end before hand-in
        // passwordRegex.test(password.value),
        signUpInfo.firstName.length > 1,
        signUpInfo.lastName.length > 1,
        emailRegex.test(signUpInfo.email),
        signUpInfo.password.length > 7,
    ]
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
    userService.userValidation({ ...req.body }).then((serviceResponse) => {
        if (serviceResponse[0].confirmationCode === req.body.code) {
            //change user status
            userService.approveEmailAddress(serviceResponse[0]._id)
            //remove code
            //login
            req.session.userId = serviceResponse[0]._id
            res.redirect('/')
        } else {
            res.redirect('/confirm/' + req.body.code)
        }
    })
})

routerUsers.all('/api/users/*', (req, res, next) => {
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
    console.log(`req.session.userId ${req.session.userId}`)
    const token = await getCsrfToken(req.session.userId)
    res.json({ csrfToken: token })
})

export default routerUsers
