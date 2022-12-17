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

function getBoundary(request) {
  let contentType = request.headers['content-type']
	if(!contentType){return;}
  const contentTypeArray = contentType.split(';').map(item => item.trim())
  const boundaryPrefix = 'boundary='
  let boundary = contentTypeArray.find(item => item.startsWith(boundaryPrefix))
  if (!boundary) return null
  boundary = boundary.slice(boundaryPrefix.length)
  if (boundary) boundary = boundary.trim()
  return boundary
}

const isMultipartFormData = (headers) => {
	const contentType = headers['content-type'];
	return !contentType ? false : contentType.includes('multipart/form-data');
}

const readReqBody = (req, boundary) => {
	let rawData = ''
	req.on('data', chunk => {
		rawData += chunk
	})

	req.on('end', () => {
		let parsedData = querystring.decode(rawData)
		console.log("parsed data: ", parsedData);
		const rawDataArray = rawData.split(boundary);
		for(let item of rawDataArray) {
			console.log("item;	", item);
			// Use non-matching groups to exclude part of the result
			// let name = getMatching(item, /(?:name=")(.+?)(?:")/)
			// if (!name || !(name = name.trim())) continue
		}
	});
}

export const withFormidable = (req, res, next) => {

	const form = formidable.IncomingForm();
	form.parse(req, (err, fields, files) => {
		console.log("Fields: ", fields);
	})
}

/**
 * CSRF Guard only applies to POST methods for users that have a valid session.
 * Preconditions for CSRF protection to be met:
 * - No get requests alter the application state
 * - No post requests alter the application state unless a user is authenticated and has a valid session.
 */
export const CSRFGuard = (req, res, next) => {
	try {
		console.log("req.headers", req.headers);
		console.log("Checking req.headers.content-type : ", req.headers["content-type"]);
		console.log("boundary: ", getBoundary(req));
		console.log("isMultipartFormData: ", isMultipartFormData(req.headers));
		const boundary = getBoundary(req);
		if (isMultipartFormData(req.headers)) {
			// console.log("We're in the if statement!!!!!")
			// // Use latin1 encoding to parse binary files correctly
			// const request = req;
			// request.setEncoding('latin1')
			// readReqBody(req, boundary);
			const form = new formidable.IncomingForm();
			form.parse(req, (err, fields, files) => {
				if(err){
					throw new Error(err);
				}
				if(!fields.csrfToken){
					throw new Error("Missing CSRF token");
				}

				const csrfUserId = decryptToken(fields.csrfToken);
				const sameSame = compareString(req.session.userId, csrfUserId);
				if(!sameSame) {
					throw new Error("CSRF token does not match!");
				}
				delete req.body.csrfToken
				console.log("Fields: ", fields);
			})
			//console.log("req raw: ", req.rawData);
			
			next();
		}
		// if ((req.method === 'POST' || req.method === 'PUT') && req.session.userId) {
		// 	//console.log("req: ", req);
		// 	//console.log("buffer: ", Buffer.from(req.buffer));
		// 	//console.log("csrf: " + JSON.stringify(req.body));
		// 	//const { csrfToken } = req.body;
		// 	console.log("csrf: " + csrfToken);
		// 	if(!csrfToken) {
		// 		throw new Error("Missing CSRF token!");
		// 	}
		// 	const csrfUserId = decryptToken(csrfToken);
			
		// 	const sameSame = compareString(req.session.userId, csrfUserId);
		// 	if(!sameSame) {
		// 		throw new Error("CSRF token does not match!");
		// 	}
		// 	delete req.body.csrfToken
		// }
		// next();
	} catch (err) {
		res.status(401).send({message: err.message});
	}
}