import { prisma } from './dbService.js'
import { POST_STATE } from '../util/enum.js'

export function getAllPostsForUsers() {
    return prisma.posts.findMany({
        where: {
            state: { equals: POST_STATE.PUBLISHED },
        },
    })
}
export function getAllPostsForAdmin() {
    return prisma.posts.findMany()
}

export function getAllPostsBySearchForUsers(searchKey) {
    return prisma.posts.findMany({
        where: {
            state: { equals: POST_STATE.PUBLISHED },
            OR: [
                { title: { contains: searchKey, mode: 'insensitive' } },
                { description: { contains: searchKey, mode: 'insensitive' } },
            ],
        },
    })
}

export function getAllPostsBySearchForAdmin(searchKey) {
    return prisma.posts.findMany({
        where: {
            OR: [
                { title: { contains: searchKey, mode: 'insensitive' } },
                { description: { contains: searchKey, mode: 'insensitive' } },
            ],
        },
    })
}

export function getAllPostsByTypeForUsers(requestedType) {
    return prisma.posts.findMany({
        where: {
            type: requestedType,
            state: { equals: POST_STATE.PUBLISHED },
        },
    })
}

export function getAllPostsByTypeForAdmin(requestedType) {
    return prisma.posts.findMany({
        where: {
            type: requestedType,
        },
    })
}

export function getAllPostsByUserForUsers(requestedUser) {
    return prisma.posts.findMany({
        where: {
            state: { equals: POST_STATE.PUBLISHED },

            user: {
                equals: requestedUser,
            },
        },
    })
}
export function getAllPostsByUserForAdmin(requestedUser) {
    return prisma.posts.findMany({
        where: {
            user: {
                equals: requestedUser,
            },
        },
    })
}

export function getPostByIdForUsers(id) {
    return prisma.posts.findFirst({
        where: { id: id, state: POST_STATE.PUBLISHED },
    })
}

export function getPostByIdForAdmin(id) {
    return prisma.posts.findUnique({
        where: { id: id },
    })
}

export function createPostByUser(post) {
    return prisma.posts.create({ data: { ...post } })
}

//Update one post
export function updatePostByUser(id, updates) {
    return prisma.posts.update({
        where: {
            id: id,
        },
        data: {
            ...updates,
        },
    })
}

//Delete one post
export function deletePost(id) {
    return prisma.posts.delete({
        where: {
            id: id,
        },
    })
}
