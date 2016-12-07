const express = require("express");
const router = express.Router();
const data = require("../data");
const usersData = data.users;

module.exports = function (passport) {
	router.get("/new", (req, res) => {
		res.render("layouts/newAccount", { pageTitle: "Create a new account!" });
	});

	router.post("/new", (req, res) => {
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
			res.render("layouts/newAccount", { pageTitle: "Create a new account!", username: username, password: password, firstName: firstName, lastName: lastName, email: email, phoneNum: phoneNum, zipCode: zipCode, error: e });
			return;
		});
	});

	router.get("/login", (req, res) => {
		return res.render("layouts/login", { pageTitle: "Login!" })
	})

	router.post("/login", (req, res, next) => {
		passport.authenticate("local", (err, user, info) => {
			if (err) {
				return res.redirect("/");
			}
			if (!user) {
				return res.redirect("/");
			}
			req.login(user, (err) => {
				if (err) {
					return next(err);
				}
				console.log(user);
				return res.redirect("/users/username/" + user.userProfile.username);
			})
		})(req, res, next);
	})
	return router;
}