import bcrypt from 'bcrypt'

const saltRounds = 12

export function passwordToHash(password) {
    return bcrypt.hashSync(password, saltRounds)
}

export function compareHash(password, hashed) {
    return bcrypt.compareSync(password, hashed)
}
