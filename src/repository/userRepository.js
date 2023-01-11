import { prisma } from './dbService.js'

export function getUserByMail(email) {
    return prisma.users.findFirst({
        where: { email: email },
    })
}

export function createUser(userDetails) {
    return prisma.users.create({
        data: { ...userDetails },
    })
}

export function getUserById(userId) {
    return prisma.users.findUnique({ where: { id: userId } })
}

export function pushNotification(userId, notification) {
    return prisma.users.update({
        where: { id: userId },
        data: {
            notifications: { push: notification },
        },
    })
}

export function removeNotification(userId, notification) {
    return prisma.users.update({
        where: {
            id: userId,
        },
        data: { notification: { unset: notification } },
    })
}

export function approveUser(userId) {
    prisma.users
        .update({
            where: { id: userId },
            data: {
                status: 'approve',
            },
        })
        .then((result) => {
            console.log(result)
            return result
        })
        .catch((e) => {
            console.log(e)
        })
}
