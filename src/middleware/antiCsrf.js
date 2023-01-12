import crypto from 'crypto-js';
import { deleteFile } from '../services/picture-service.js';

const getTimestampSeconds = () => {
	return Math.floor(Date.now() / 1000);
}
const checkTimestamp = (time) => {
	console.log("checking timestamp: ", (getTimestampSeconds() - time));
	return (getTimestampSeconds() - time) < 900; // 900 = 15 minutes
}

export const getCsrfToken = (userId) => {
	const timestampSeconds = getTimestampSeconds();
	const tokenObj = JSON.stringify({userId: userId, timestampSeconds: timestampSeconds});
	console.log("tokenObj before encrypting: ", tokenObj);
	const token = crypto.AES.encrypt(tokenObj, process.env.CSRF_SECRET).toString();
	return token;
}

const decryptToken = (token) => {
	const decrypted = crypto.AES.decrypt(token, process.env.CSRF_SECRET).toString(crypto.enc.Utf8);
	console.log("decrypted: ", decrypted);
	return decrypted;
}

const compareString = (a, b) => {
	a = a.toUpperCase().trim();
	b = b.toUpperCase().trim();
	return a === b;
}


const checkCSRFToken = (token, userId) => {
	const tokenObjString = decryptToken(token);
	const tokenObj = JSON.parse(tokenObjString);
	const validTimestamp = checkTimestamp(tokenObj.timestampSeconds);
	const validUserId = compareString(userId, tokenObj.userId);
	return validUserId && validTimestamp;
}

// Our location is our domain, running locally, it would be "http://localhost:PORT"
const ourLocation = process.env.OUR_LOCATION;
const ourAllowedLocationPaths = [
	"",
	"/createPost"
];
// Add to this array for all referers and origins allowed.
const allowedLocations = [];
ourAllowedLocationPaths.forEach(path => allowedLocations.push(ourLocation + path));

/**
 * CSRF Guard only applies to POST methods for users that have a valid session.
 * Preconditions for CSRF protection to be met:
 * - No get requests alter the application state
 * - No post requests alter the application state unless a user is authenticated and has a valid session.
 */
export const CSRFGuard = async (req, res, next) => {
	try {
		if ((req.method === 'POST' || req.method === 'PUT') && req.session.userId) {
			// Last minute changes, Chrome does not send referer and origin on POST and PUT requests.
			// console.log("req.headers: ", req.headers);
			const origin = req.headers.origin;
			const referer = req.headers.referer;
			console.log("req.session: ", req.session);
			console.log("origin: ", origin, " referer: ", referer);
			// if(!allowedLocations.includes(origin) || !allowedLocations.includes(referer)){
			// 	throw new Error("Invalid origin: " + origin + ", or invalid referer: " + referer);
			// }
			const { csrfToken } = req.body;
		 	if(!csrfToken) {
		 		throw new Error("Missing CSRF token!");
		 	}

			const validCSRF = checkCSRFToken(csrfToken, req.session.userId);
			if(!validCSRF){
				throw new Error("Invalid CSRF token!");
			}
			// csrf token has served it's purpose, no need to keep it in the req body.
			delete req.body.csrfToken
		}

		next();
	} catch (err) {
		console.log("Error caught in antiCSRF: ", err);
		// Image upload handling happens before csrf token is checked.
		if(req.file){
			deleteFile(req.file);
		}
		res.redirect('/error')
	}
}
