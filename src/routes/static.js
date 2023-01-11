import { Router } from 'express'
import {
    cssTamplate,
    footer,
    profileNav,
    nav,
    feed,
    login,
    confirmLogin,
    signup,
    errorPage,
    cookieModal,
    failedSignup,
    completeSignup,
} from '../static-pages/staticPages.js'

function title(titleName) {
    if (titleName === null || titleName === undefined) {
        titleName = 'H2H'
    }
    return `<title> ${titleName} </title>`
}

// Instantiate constants CSS and FOOTER already loaded in staticPages.js
const CSS = cssTamplate
const FOOTER = footer

const routerStatic = Router()

let navbar

routerStatic.use(function (req, res, next) {
    navbar = req.session.userId ? profileNav : nav
    if (!req.session.sawCookie) {
        navbar = navbar + cookieModal
        req.session.sawCookie = true
    }
    return next()
})

routerStatic.get('/', (req, res) => {
    res.send(CSS + title('H2H') + navbar + feed + FOOTER)
})

routerStatic.get('/error', (req, res) => {
    res.send(CSS + title('H2H') + navbar + errorPage + FOOTER)
})

routerStatic.get('/requested', (req, res) => {
    res.send(CSS + title('H2H') + navbar + feed + FOOTER)
})

routerStatic.get('/provided', (req, res) => {
    res.send(CSS + title('H2H') + navbar + feed + FOOTER)
})

routerStatic.get('/search', (req, res) => {
    res.send(CSS + title('H2H') + navbar + feed + FOOTER)
})

routerStatic.get('/login', (req, res) => {
    if (req.session.userId) {
        res.redirect('/')
    }
    res.send(CSS + title('H2H - Login') + navbar + login + FOOTER)
})

routerStatic.get('/confirm/:code', (req, res) => {
    res.send(CSS + title('H2H - Confirmation') + navbar + confirmLogin + FOOTER)
})

routerStatic.get('/signup', (req, res) => {
    if (req.session.userId) {
        res.redirect('/')
    }
    res.send(CSS + title('H2H - Signup') + navbar + signup + FOOTER)
})

routerStatic.get('/signup/complete', (req, res) => {
    res.send(CSS + title('H2H - Signup') + navbar + completeSignup + FOOTER)
})

routerStatic.get('/signup/failed', (req, res) => {
    res.send(CSS + title('H2H - Signup') + navbar + failedSignup + FOOTER)
})

export default routerStatic
