import express from 'express'
import {
    deletePostService,
    getAllPosts,
    getAllPostsBySearch,
    getAllPostsByType,
    getAllPostsByUser,
    updatePost,
    createPost,
    getPostById,
} from '../services/postService.js'
import { userRoleMapper } from '../util/typeMapper.js'
import { upload } from '../services/picture-service.js'

const routerPosts = express.Router()

routerPosts.get('/api/posts', async (req, res) => {
	const userRole = userRoleMapper(req.session.role)
	if (Object.keys(req.query).length === 0)
		await getAllPosts(userRole).then((posts) => {
				res.send({ posts })
		})
	if (req.query.type)
		await getAllPostsByType(req.query.type, userRole).then((posts) =>
				res.send({ posts })
		)
	if (req.query.user)
		await getAllPostsByUser(req.session.userId, userRole).then((result) =>
			res.send({ posts: result })
		)
	if (req.query.post)
		await getAllPostsBySearch(req.query.post).then((result) =>
			res.send({ posts: result })
		)
})

routerPosts.all('/api/post/*', (req, res, next) => {
	if (!req.session.userId) {
		res.sendStatus(401)
	} else {
		next()
	}
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

routerPosts.post('/api/post', upload.single('file'), (req, res) => {
	// should make a check that we are receiving only post things
	console.log("filename :" + req.body.fileName)
	console.log("req body in post :", req.body)
	if(req.body.csrfToken){
		delete req.body.csrfToken
	}
	createPost(req.session.userId, req.body).then(() => {
		//TODO: handle response
		//res.send(post) //maybe should return a json object and the redirect will happen from the public folder
		res.redirect('/')
	})
})

routerPosts.patch('/api/post/:id', upload.single('file'), (req, res) => {
	if(req.body.csrfToken){
		delete req.body.csrfToken
	}
	updatePost(req.session.userId, req.body, req.query.id).then((response) => {
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
