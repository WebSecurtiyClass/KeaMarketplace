import express from 'express'
import {
    deletePostService,
    getAllPosts,
    getAllPostsByType,
    getAllPostsByUser,
    updatePost,
    createPost,
    getPostById,
    getAllPostsBySearch,
} from '../services/postService.js'
import { userRoleMapper } from '../util/typeMapper.js'

const routerPosts = express.Router()

routerPosts.get('/api/posts', async (req, res) => {
    const userRole = userRoleMapper(req.session.role)
    if (Object.keys(req.query).length === 0)
        await getAllPosts(userRole).then((posts) => {
            res.send({ posts })
        })
    else if (req.query.type)
        await getAllPostsByType(req.query.type, userRole).then((posts) =>
            res.send({ posts })
        )
    else if (req.query.user)
        await getAllPostsByUser(req.session.userId, userRole).then((result) =>
            res.send({ posts: result })
        )
    else if (req.query.post)
        await getAllPostsBySearch(req.query.post).then((result) =>
            res.send({ posts: result })
        )
    else {
        res.sendStatus(404)
    }
})

routerPosts.all('/api/post/*', (req, res, next) => {
    if (!req.session.userId) {
        res.sendStatus(401)
    } else {
        next()
    }
})

routerPosts.get('/api/post/me/:id', async (req, res) => {
    const post = await getPostById(
        req.params.id,
        userRoleMapper(req.session.role)
    )
    req.session.userId === post.user ? res.send(post) : res.sendStatus(404)
})

routerPosts.get('/api/post/:id', (req, res) => {
    getPostById(req.params.id, userRoleMapper(req.session.role))
        .then((post) => {
            return res.send({ post })
        })
        //checks for error handling
        .catch(() => {
            res.sendStatus(404)
        })
})

routerPosts.post('/api/post', (req, res) => {
    // should make a check that we are receiving only post things
    createPost(req.session.userId, req.body).then(() => {
        //TODO: handle response
        //res.send(post) //maybe should return a json object and the redirect will happen from the public folder
        res.redirect('/')
    })
})

routerPosts.patch('/api/post/:id', (req, res) => {
    updatePost(req.session.userId, req.body, req.params.id).then((response) => {
        response ? res.redirect('/') : res.sendStatus(401)
    })
})

routerPosts.delete('/api/post/:id', async (req, res) => {
    if (!req.session.userId) {
        res.sendStatus(401)
    }
    const deletePost = await deletePostService(
        req.params.id,
        req.session.userId,
        req.session.role
    )
    deletePost ? res.redirect('/') : res.redirect('/resourceNotFound')
})

export default routerPosts
