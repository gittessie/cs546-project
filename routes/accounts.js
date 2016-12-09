const express = require("express");
const router = express.Router();
const data = require("../data");
const usersData = data.users;

module.exports = function (passport) {
	router.get("/new", (req, res) => {
		res.render("layouts/newAccount", { pageTitle: "Create a new account!" });
	});

	router.post("/new", (req, res, next) => {
		let username = req.body.username;
		let password = req.body.password;
		let password2 = req.body.password2;
		let firstName = req.body.firstName;
		let lastName = req.body.lastName;
		let email = req.body.email;
		let phoneNum = req.body.phoneNum;
		let zipCode = req.body.zipCode;
		let error;
		if (!username || !password || !password2 || !firstName || !lastName || !email || !phoneNum || !zipCode){
			error = "Please complete all fields";
			res.render("layouts/newAccount", { pageTitle: "Create a new account!", username: username, password: password, password2: password2, firstName: firstName, lastName: lastName, email: email, phoneNum: phoneNum, zipCode: zipCode, error: error });
			return;
		}
		if (password2 !== password) {
            res.render("layouts/newAccount", { pageTitle: "Create a new account!", username: username, password: password, password2: password2, firstName: firstName, lastName: lastName, email: email, phoneNum: phoneNum, zipCode: zipCode, error: "Passwords do not match" });
			return;
		}

		usersData.usernameAvailable(username)
			.then((usernameAvailable) => {
				if (usernameAvailable) {
					usersData.emailAvailable(email)
						.then((emailAvailable) => {
							if (emailAvailable) {
								usersData.addUser(username, password, firstName, lastName, email, phoneNum, zipCode).then(() => {
									usersData.getUserByUsername(username).then((thisProfile) => {
										authenticate(passport, req, res)(req, res, next);
									});
								}).catch((e) => {
									res.render("layouts/newAccount", { pageTitle: "Create a new account!", username: username, password: password, password2: password2, firstName: firstName, lastName: lastName, email: email, phoneNum: phoneNum, zipCode: zipCode, error: e });
									return;
								});
							}
							else {
								return res.render("layouts/newAccount", { pageTitle: "Create a new account!", username: username, password: password, password2: password2, firstName: firstName, lastName: lastName, email: email, phoneNum: phoneNum, zipCode: zipCode, error: "Email already in use" });
							}
						})
				}
				else {
					return res.render("layouts/newAccount", { pageTitle: "Create a new account!", username: username, password: password, password2: password2, firstName: firstName, lastName: lastName, email: email, phoneNum: phoneNum, zipCode: zipCode, error: "Username already exists" });
				}
			})
	});

	router.get("/login", (req, res) => {
		return res.render("layouts/login", { pageTitle: "Login!" })
	})

	router.post("/login", (req, res, next) => {
		authenticate(passport, req, res)(req, res, next);
	})

	router.get("/logout", (req, res) => {
		req.logout();
		res.redirect('/');
	})

	//my account link
	router.get("/myaccount/", (req, res) => {
		if(req.user){
				// user is logged in, display account
				// get user profile info
				usersData.getUserByUsername(req.user.userProfile.username).then((thisUser) => {
					res.render("layouts/account", { pageTitle: req.user.userProfile.username + "'s Account", profile: thisUser.userProfile, id:req.user._id });
				}).catch((e) => {
					res.status(500).json({ error: e });
				});

		}else{
				// user is not logged in, redirect to login page
				res.redirect("/account/login")
		}
	})

	//edit account
	router.get("/edit", (req, res) => {
		if(req.user){
				// user is logged in, display account
				// get user profile info
				usersData.getUserByUsername(req.user.userProfile.username).then((thisUser) => {
					res.render("layouts/accountEdit", { pageTitle: "My Account", profile: thisUser.userProfile});
				}).catch((e) => {
					res.status(500).json({ error: e });
				});

		}else{
				// user is not logged in, redirect to login page
				res.redirect("/account/login")
		}
	})

	router.post("/edit", (req, res, next) => {
		let username = req.body.username;
		let idNum = req.body.idNum;
		let newFirstName = req.body.newFirstName;
		let newLastName = req.body.newLastName;
		let newEmail = req.body.newEmail;
		let newPhoneNum = req.body.newPhoneNum;
		let newZipCode = req.body.newZipCode;
		let error;
		if (!newFirstName || !newLastName || !newEmail || !newPhoneNum || !newZipCode){
			error = "Please complete all fields";
			res.render("account/edit", { pageTitle: "Update Profile", firstName: newFirstName, lastName: newLastName, email: newEmail, phoneNum: newPhoneNum, zipCode: newZipCode, error: error });
			return;
		}

		let updatedProfile = {userProfile: {firstName: newFirstName, lastName: newLastName, email: newEmail, phone: newPhoneNum, zip: newZipCode}};
		usersData.updateUserProfile(idNum, newFirstName, newLastName, newEmail, newZipCode, newPhoneNum).then((newUserProfile) => {
				res.render("account/myaccount", { pageTitle: "My Account", profile: thisUser.userProfile });
			}).catch((e) => {
				res.redirect("/account/myaccount")
			});
	});






	return router;
}

let authenticate = (passport, req, res) => {
	return passport.authenticate("local", (err, user, info) => {
		if (err) {
			return res.render("layouts/login", { error: "Invalid credentials" });
		}
		if (!user) {
			if (!req.body.username && !req.body.password)
				return res.render("layouts/login", { error: "Missing username and password" });
			if (!req.body.username)
				return res.render("layouts/login", { error: "Missing username" });
			if (!req.body.password)
				return res.render("layouts/login", { error: "Missing password" });
			return res.render("layouts/login", { error: "Unknown error, please try again" });
		}
		req.login(user, (err) => {
			if (err) {
				return next(err);
			}
			return res.redirect("/account/myaccount");
		})
	})
}
