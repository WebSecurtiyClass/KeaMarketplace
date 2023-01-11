import mongodb from 'mongodb'
import * as dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
dotenv.config()

const MongoClient = mongodb.MongoClient
const url = process.env.DB_CONNECTION
const dbName = process.env.DB_NAME

let db
export const prisma = new PrismaClient()

const loadDB = async () => {
    if (db) {
        return db
    }
    try {
        const client = await MongoClient.connect(url, {
            useUnifiedTopology: true,
        })
        db = client.db(dbName)
    } catch (err) {
        new Error(error)
    }
    return db
    //return prisma
}

//PROMISES

const promiseGet = async (collection, query) => {
    const db = await loadDB()
    if (query === undefined) query = {} //checks if the query was passed as an arguemnt
    return new Promise((resolve, reject) => {
        db.collection(collection)
            .find(query)
            .toArray((error, result) => {
                if (error) {
                    reject(new Error(error))
                } else {
                    resolve(result)
                }
            })
    })
}

//Promise for createPost()
const promiseCreate = async (collection, query) => {
    const db = await loadDB()
    return new Promise((resolve, reject) => {
        db.collection(collection).insertOne(query, (error, result) => {
            if (error) {
                reject(new Error(error))
            } else {
                resolve(result)
            }
        })
    })
}

//Promise for updatePost()
const promiseUpdate = async (collection, id, updates, operator) => {
    const db = await loadDB()
    let query
    return new Promise((resolve, reject) => {
        switch (operator) {
            case 'push': //add element to array in subcollection
                query = {
                    $push: updates,
                }
                break
            case 'pull': //remove element from subcollection
                query = {
                    $pull: updates,
                }
                break
            default: //update element
                query = {
                    $set: updates,
                }
                break
        }
        db.collection(collection).updateOne(
            { _id: mongodb.ObjectID(id) },
            query,
            (error, result) => {
                if (error) {
                    reject(new Error(error))
                } else {
                    resolve(result)
                }
            }
        )
    })
}

//Promise for deleting a post
const promiseDelete = async (collection, id) => {
    const db = await loadDB()

    return new Promise((resolve, reject) => {
        db.collection(collection).deleteOne(
            { _id: new mongodb.ObjectID(id) },
            (error, result) => {
                if (error) {
                    reject(new Error(error))
                } else {
                    resolve(result)
                }
            }
        )
    })
}

export { promiseGet, promiseCreate, promiseUpdate, promiseDelete }
