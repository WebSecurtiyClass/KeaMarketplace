import crypto from 'crypto-js';

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

/**
 * CSRF Guard only applies to POST methods for users that have a valid session.
 * Preconditions for CSRF protection to be met:
 * - No get requests alter the application state
 * - No post requests alter the application state unless a user is authenticated and has a valid session.
 */
export const CSRFGuard = (req, res, next) => {
	try {
		if (req.method === 'POST' && req.session.userId) {
			const { csrfToken } = req.body;
			if(!csrfToken) {
				throw new Error("Missing CSRF token!");
			}
			const csrfUserId = decryptToken(csrfToken);
			
			const sameSame = compareString(req.session.userId, csrfUserId);
			if(!sameSame) {
				throw new Error("CSRF token does not match!");
			}
			delete req.body.csrfToken
		}
		next();
	} catch (err) {
		res.status(401).send({message: err.message});
	}
}