import { Router } from 'express'
import {
    cssTamplate,
    footer,
    profileNav,
    feed,
    createPost,
    viewPost,
    pageNotFound,
    updatePost,
} from '../static-pages/staticPages.js'

function title(titleName) {
    if (titleName === null || titleName === undefined) {
        titleName = 'H2H'
    }
    return `<title> ${titleName} </title>`
}

const routerStaticAuth = Router()

const CSS = cssTamplate
const FOOTER = footer
const navbar = profileNav

routerStaticAuth.use(function (req, res, next) {
    if (req.session.userId) {
        next()
    } else {
        res.redirect('/login')
    }
})

routerStaticAuth.get('/myoffers', (req, res) => {
    res.send(CSS + title('H2H- My Offers') + navbar + feed + FOOTER)
})

routerStaticAuth.get('/logout', (req, res) => {
    if (req.session.userId) delete req.session.userId
    res.redirect('/')
})

routerStaticAuth.get('/posts/:id', (req, res) => {
    res.send(CSS + title('H2H - Post') + navbar + viewPost + FOOTER)
})

routerStaticAuth.get('/createPost', (req, res) => {
    res.send(CSS + title('H2H - New Post') + navbar + createPost + FOOTER)
})

routerStaticAuth.get('/updatePost/:id', (req, res) => {
    res.send(
        CSS +
            title('H2H - Update Post') +
            navbar +
            createPost +
            updatePost +
            FOOTER
    )
})

//get for all the other pages
routerStaticAuth.get('/*', (req, res) => {
    res.send(
        CSS + title('H2H - Page not found') + navbar + pageNotFound + FOOTER
    )
})

export default routerStaticAuth
