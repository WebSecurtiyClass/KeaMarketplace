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
import { deleteFile } from '../services/picture-service.js'
import multer from 'multer'

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
	try {
		createPost(req.session.userId, req.body).then(() => {
			//TODO: handle response
			//res.send(post) //maybe should return a json object and the redirect will happen from the public folder
			res.redirect('/')
		})
	} catch (e) {
		console.log("Error creating post: " + e.message)
		// Most likely a post will have included a file, in which case we want to delete it since posting failed.
		if(req.file){
			deleteFile(req.file)
		}
		res.redirect('/error')
	}

})

routerPosts.patch('/api/post/:id', (req, res) => {
    updatePost(req.session.userId, req.body, req.params.id).then((response) => {
        response ? res.json({message:"Success"}) : res.sendStatus(401)
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

routerPosts.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when handling the file upload
    return res.redirect('/error');
  } else {
    // Handle other errors
		return res.redirect('/error');
    //next(err);
  }
});

export default routerPosts
