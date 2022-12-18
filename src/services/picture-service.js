import { v4 as uuid } from 'uuid';
import multer from 'multer';

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./public/assets/post-images");
	},
	filename: (req, file, cb) => {
		console.log(file);

		const id = uuid();
		const fileName = id + "_" + "pic.jpg";
		req.body.fileName = fileName;
		cb(null, fileName);
	}
})

export const upload = multer({storage: storage})

