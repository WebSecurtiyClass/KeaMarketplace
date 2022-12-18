import crypto from 'crypto-js';
import querystring from 'querystring';
import formidable from 'formidable';
export const getCsrfToken = (userId) => {
	const token = crypto.AES.encrypt(userId, process.env.CSRF_SECRET).toString();
	return token;
}

const decryptToken = (token) => {
	const decrypted = crypto.AES.decrypt(token, process.env.CSRF_SECRET).toString(crypto.enc.Utf8);
	return decrypted;
}

const compareString = (a, b) => {
	a = a.toUpperCase().trim();
	b = b.toUpperCase().trim();
	return a === b;
}

const isMultipartFormData = (headers) => {
	const contentType = headers['content-type'];
	return !contentType ? false : contentType.includes('multipart/form-data');
}

const checkCSRFToken = (token, userId) => {
	const csrfUserId = decryptToken(token);
	const sameSame = compareString(userId, csrfUserId);
	if(!sameSame) {
		throw new Error("CSRF token does not match!");
	}
}

/**
 * CSRF Guard only applies to POST methods for users that have a valid session.
 * Preconditions for CSRF protection to be met:
 * - No get requests alter the application state
 * - No post requests alter the application state unless a user is authenticated and has a valid session.
 */
export const CSRFGuard = (req, res, next) => {
	try {
		if (isMultipartFormData(req.headers)) {
			const form = new formidable.IncomingForm();
			form.parse(req, (err, fields, files) => {
				if(err){
					throw new Error(err);
				}
				if(!fields.csrfToken){
					throw new Error("Missing CSRF token");
				}
				checkCSRFToken(fields.csrfToken, req.session.userId);
				delete fields.csrfToken;
			});
		} else if ((req.method === 'POST' || req.method === 'PUT') && req.session.userId) {
			const { csrfToken } = req.body;
		 	console.log("csrf: " + csrfToken);
		 	if(!csrfToken) {
		 		throw new Error("Missing CSRF token!");
		 	}
			checkCSRFToken(csrfToken, req.session.userId);
			delete req.body.csrfToken
		}
		next();
	} catch (err) {
		res.status(401).send({message: err.message});
	}
}