import { v4 as uuid } from 'uuid';
import multer from 'multer';
import {promisify} from 'util';
import fs from 'fs'

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./public/assets/post-images");
	},
	filename: (req, file, cb) => {
		const id = uuid();
		const fileName = id + "_" + "pic.jpg";
		req.body.fileName = fileName;
		cb(null, fileName);
	}
})

const fileFilter = (req, file, cb) => {
	// Only accept image files
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
		return cb(new Error('Only image files are allowed'), false);
  }
  cb(null, true);
};

const ONE_MEGABYTE = 1024 * 1024;

export const upload = multer({storage: storage, fileFilter: fileFilter, limits: { fileSize: ONE_MEGABYTE }})
const uppidy = promisify(upload.single('file')); // change callback function to async function.

const isMultipartFormData = (headers) => {
	const contentType = headers['content-type'];
	return !contentType ? false : contentType.includes('multipart/form-data');
}

export const pictureUploadGuard = async (req, res, next) => {
	try {
		if (isMultipartFormData(req.headers)) {
			await uppidy(req, res, (err) => {
				if(err){
					console.log("Error: ", err)
					res.redirect('/error');
					return;
				} else {
					next();
					return;
				}
			});
		}
		next();
	} catch (e) {
		console.log("[WARNING] Catching error in pictureUploadGuard - unexpected behaviour ", e.message);
		res.redirect('/error');
		return;
	}
}

const unlinkAsync = promisify(fs.unlink) // change callback function to async function.

export const deleteFile = async (file) => {
	try {
		if(!file){
			throw new Error("Called deleteFile with an undefined or null file object");
		}
		console.log("Deleting file if exists...")
		console.log("filename: ", file.filename);
		unlinkAsync(file.path)
	} catch (e) {
		console.log("[WARNING] Error deleting file, we have an orphan");
	}
}
