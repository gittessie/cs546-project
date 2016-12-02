const express = require("express");
const router = express.Router();
const data = require("../data");
const usersData = data.users;

router.get("/", (req, res) => {
	res.render("layouts/form", { pageTitle: "Create a new account!" });
});

router.post("/", (req, res) => {
	let username = req.body.username;
	let password = req.body.password;
	let firstName = req.body.firstName;
	let lastName = req.body.lastName;
	let email = req.body.email;
	let phoneNum = req.body.phoneNum;
	let zipCode = req.body.zipCode;

	usersData.addUser(username, password, firstName, lastName, email, phoneNum, zipCode).then(() => {
		usersData.getUserByUsername(username).then((thisProfile) => {
			res.render("layouts/users", { pageTitle: username + "'s Profile", profile: thisProfile.userProfile });
		});
	}).catch((e) => {
		res.render("layouts/form", { pageTitle: "Create a new account!",  username: username, password: password, firstName: firstName, lastName: lastName, email: email, phoneNum: phoneNum, zipCode: zipCode, error: e });
		return;
	});
});

module.exports = router;