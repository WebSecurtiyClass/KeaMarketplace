import {
    getPostByIdForUsers,
    updatePostByUser,
    deletePost,
    getAllPostsForUsers,
    getAllPostsForAdmin,
    getAllPostsByTypeForUsers,
    getAllPostsByTypeForAdmin,
    getAllPostsByUserForUsers,
    getAllPostsByUserForAdmin,
    getAllPostsBySearchForAdmin,
    getAllPostsBySearchForUsers,
    createPostByUser,
    getPostByIdForAdmin,
} from '../repository/postRepository.js'
import { POST_STATE, USER_ROLE } from '../util/enum.js'

export function getAllPosts(userRole) {
    return userRole === USER_ROLE.ADMIN
        ? getAllPostsForAdmin()
        : getAllPostsForUsers()
}

export function getAllPostsByType(postType, userRole) {
    return userRole === USER_ROLE.ADMIN
        ? getAllPostsByTypeForAdmin(postType)
        : getAllPostsByTypeForUsers(postType)
}

export function getAllPostsByUser(userId, userRole) {
    return userRole === USER_ROLE.ADMIN
        ? getAllPostsByUserForAdmin(userId)
        : getAllPostsByUserForUsers(userId)
}

export function getAllPostsBySearch(searchKey, userRole) {
    return userRole === USER_ROLE.ADMIN
        ? getAllPostsBySearchForAdmin(searchKey)
        : getAllPostsBySearchForUsers(searchKey)
}

export function getPostById(postId, userRole) {
    return userRole === USER_ROLE.ADMIN
        ? getPostByIdForAdmin(postId)
        : getPostByIdForUsers(postId)
}

export function createPost(userId, post) {
    const postToCreate = {
        ...post,
        user: userId,
    }
    return createPostByUser(postToCreate)
}

export async function updatePost(userId, postDetails, postToUpdateId) {
    const post = await getPostByIdForUsers(postId)
    if (!post.user === userId) return false
    else {
        updatePostByUser(postToUpdateId, { post, ...postDetails })
        return true
    }
}

export async function deletePostService(postId, userId, userRole) {
    // checks if user has created this post
    if (userRole !== USER_ROLE.ADMIN) {
        const post = await getPostByIdForUsers(postId)
        if (!post.user === userId) return false
        await updatePostByUser(postId, { state: POST_STATE.ARCHIVED })
        return true
    } else {
        await deletePost(postId)
        return true
    }
}
