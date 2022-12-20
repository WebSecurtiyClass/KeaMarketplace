import { dirname } from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

/**
 * Not sure if this loads on a per call basis?
 * If so, then it might be a good idea to create a load function that set them as globals or something like that.
 * - File reading is cpu intensive.
 */

const __dirname = dirname(fileURLToPath(import.meta.url)) + '/../..';

const cssTamplate = fs.readFileSync(
	__dirname + '/public/templates/cssTamplates/cssTamplate.html',
	'utf-8'
);

const footer = fs.readFileSync(
	__dirname + '/public/templates/footer/footer.html',
	'utf-8'
);

const profileNav = fs.readFileSync(
	__dirname + '/public/templates/navbar/profileNavbar/profileNavbar.html',
	'utf-8'
);

const errorPage = fs.readFileSync(
	__dirname + '/public/components/errors/errorPage.html',
	'utf-8'
)

const nav = fs.readFileSync(
	__dirname + '/public/templates/navbar/navbar.html',
	'utf-8'
);

const feed = fs.readFileSync(
	__dirname + '/public/components/feed/feed.html',
	'utf-8'
)
const login = fs.readFileSync(
	__dirname + '/public/components/login/login.html',
	'utf-8'
)
const confirmLogin = fs.readFileSync(
	__dirname + '/public/components/login/confirmLogin.html',
	'utf-8'
)
const signup = fs.readFileSync(
	__dirname + '/public/components/signup/signup.html',
	'utf-8'
)
const createPost = fs.readFileSync(
	__dirname + '/public/components/post/createPost.html',
	'utf-8'
)
const chat = fs.readFileSync(
	__dirname + '/public/components/chat/chat.html',
	'utf-8'
)
const viewPost = fs.readFileSync(
	__dirname + '/public/components/post/viewPost.html',
	'utf-8'
)
const chatList = fs.readFileSync(
	__dirname + '/public/components/chatList/chatList.html',
	'utf-8'
)
const pageNotFound = fs.readFileSync(
	__dirname + '/public/components/pageNotFound/pageNotFound.html',
	'utf-8'
)
const cookieModal = fs.readFileSync(
	__dirname + '/public/templates/cookieModal/cookieModal.html',
	'utf-8'
)

export {
	cssTamplate,
	footer,
	profileNav,
	nav,
	feed,
	login,
	confirmLogin,
	signup,
	createPost,
	chat,
	viewPost,
	chatList,
	pageNotFound,
	cookieModal,
	errorPage
}
