import express from 'express'
import { compareHash } from '../../passwordManagement.js';

const victimRouter = express.Router()

victimRouter.get('/get-attack/transfer', (req, res) => {
	/*console.log("$2b$12$fTloYmHN2rCui5k7Tp0ODevWTVjpG4mJem1/3koexzdH6FbF.luRi")
	console.log("password: ", "SUQwqj72PN5UadG!")
	const queryPass = "SUQwqj72PN5UadG!"
	const userPass = "$2b$12$fTloYmHN2rCui5k7Tp0ODevWTVjpG4mJem1/3koexzdH6FbF.luRi"*/

	//console.log("compare: ", compareHash(queryPass, userPass));
	console.log(req.session.userId);
	if(!req.session.userId){
		res.redirect('/error')
		return;
	}
	console.log("********************************")
	console.log("Victim successfully transferred to an attacker!");
	console.log("origin: ", req.headers.origin);
	console.log("referer: ", req.headers.referer);
	let fromAccount = req.query.fromAccount;
	let toAccount = req.query.toAccount;
	console.log("fromAccount: ", fromAccount)
	console.log("toAccount: ", toAccount);
	console.log("********************************")


	res.redirect('/');
});

export default victimRouter;