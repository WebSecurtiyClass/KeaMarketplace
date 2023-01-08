import { compareHash, passwordToHash } from '../../passwordManagement.js'
import {
    approveUser,
    createUser,
    getUserByMail,
    getUserById,
    pushNotification,
    removeNotification,
} from '../repository/userRepository.js'

async function userValidation(query) {
    //send db query to get user hashed password in return
    const user = await getUserByMail(query.email)

    if (!user) {
        return false
    }
    //compare the query password with the hashed db password
    return compareHash(query.password, user.password) ? user : false
}

async function signUp(signUpInfo) {
    let isCreated = false
    await getUserByMail(signUpInfo.email)
        .then(async (user) => {
            if (!user) {
                //checks if there is no user with this mail in the db
                signUpInfo.password = await passwordToHash(signUpInfo.password)
                signUpInfo.notifications = []
                createUser(signUpInfo)
                    .then((res) => console.log('success: ', res))
                    .catch((e) => console.log('error: ', e))
                isCreated = true
            }
        })
        .catch((error) => {
            console.log(error)
        })
    return isCreated
}

function getUsers(query) {
    return getUserById(query)
}

function saveNotification(roomId, type, userId) {
    const newNotification = {
        room: roomId,
        type: type,
    }
    return pushNotification(userId, newNotification)
}

function deleteNotification(roomId, type, userId) {
    const notificaionToDelete = {
        room: roomId,
        type: type,
    }
    return removeNotification(userId, notificaionToDelete)
}

function approveEmailAddress(userId) {
    return approveUser(userId)
}

export default {
    userValidation,
    signUp,
    getUsers,
    saveNotification,
    deleteNotification,
    approveEmailAddress,
}
