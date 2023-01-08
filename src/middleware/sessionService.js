import session from 'express-session'
import MongoStore from 'connect-mongo'
import * as dotenv from 'dotenv'

dotenv.config()

function createSession() {
    return session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge:
                1000 *
                60 *
                60 *
                24 *
                7 /*1000mil * 60 seconds * 60 minutes * 24 hours * 7 days*/,
            sameSite: 'Strict',
            secure: process.env === 'production',
        },
        store: MongoStore.create({
            mongoUrl: process.env.DB_CONNECTION,
            dbName: process.env.DB_NAME,
            collectionName: 'session',
        }),
    })
}

export { createSession }
