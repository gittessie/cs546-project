const express = require("express");
const router = express.Router();
const data = require("../data");
const usersData = data.users;
const itemsData = data.items;

let isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	else {
		return res.redirect("/account/login");
	}
}

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
		if (!username || !password || !password2 || !firstName || !lastName || !email || !phoneNum || !zipCode) {
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
		if (req.user) {
			res.redirect("/account/myaccount");
		}
		else {
			return res.render("layouts/login", { pageTitle: "Login!" })
		}
	})

	router.post("/login", (req, res, next) => {
		authenticate(passport, req, res)(req, res, next);
	})

	router.get("/logout", (req, res) => {
		req.logout();
		res.redirect('/');
	})

	//my account link
	router.get("/myaccount", isAuthenticated, (req, res) => {
		usersData.getUserByUsername(req.user.userProfile.username).then((thisUser) => {
			let userProfileId = thisUser.userProfile._id;
			itemsData.getItemsForUserProfileId(userProfileId).then((itemsArray) => {
				res.render("layouts/account", { pageTitle: "My Account", itemsArray: itemsArray, id: req.user._id, profile: thisUser.userProfile });
			});
			//res.render("layouts/account", { pageTitle:  "My Account", profile: thisUser.userProfile, id:req.user._id });
		}).catch((e) => {
			res.status(500).json({ error: e });
		});

	})

	//edit account
	router.get("/edit", isAuthenticated, (req, res) => {
		usersData.getUserByUsername(req.user.userProfile.username).then((thisUser) => {
			res.render("layouts/accountEdit", { pageTitle: "My Account", profile: thisUser.userProfile, userId: thisUser._id });
		}).catch((e) => {
			res.status(500).json({ error: e });
		});
	})

	router.delete("/:id", isAuthenticated, (req, res) => {
		usersData.getUserById(req.params.id)
			.then((user) => {
				usersData.deleteUser(user._id).then(() => {
					itemsData.deleteAllForUser(user.userProfile._id)
						.then((status) => {
							req.logout();
							res.status(200).json({ message: "Deleted", redirect: "/" });
						})
				}).catch((e) => {
					console.log(e);
					res.status(500).json({ error: e });
				});
			})
	});

	router.post("/edit", isAuthenticated, (req, res, next) => {
		let username = req.body.username;
		let idNum = req.body.idNum;
		let newFirstName = req.body.newFirstName;
		let newLastName = req.body.newLastName;
		let newEmail = req.body.newEmail;
		let newPhoneNum = req.body.newPhoneNum;
		let newZipCode = req.body.newZipCode;
		let error;
		if (!newFirstName || !newLastName || !newEmail || !newPhoneNum || !newZipCode) {
			error = "Please complete all fields";
			res.render("account/edit", { pageTitle: "Update Profile", firstName: newFirstName, lastName: newLastName, email: newEmail, phoneNum: newPhoneNum, zipCode: newZipCode, error: error });
			return;
		}

		//let updatedProfile = {userProfile: {firstName: newFirstName, lastName: newLastName, email: newEmail, phone: newPhoneNum, zip: newZipCode}};
		usersData.updateUserProfile(idNum, newFirstName, newLastName, newEmail, newZipCode, newPhoneNum).then((newUserProfile) => {
			res.render("account/myaccount", { pageTitle: "My Account", profile: thisUser.userProfile });
		}).catch((e) => {
			res.redirect("/account/myaccount")
		});
	});

	//edit item
	router.get("/editItem/:itemId", isAuthenticated, (req, res) => {
		itemsData.getItemById(req.params.itemId).then((thisItem) => {
			if (thisItem.userProfile._id != req.user.userProfile._id) {
				let route = path.resolve(`static/401.html`);
				res.status(401).sendFile(route);
			}
			else {
				res.render("layouts/accountItemEdit", { pageTitle: thisItem.name, itemProfile: thisItem, passedId: req.params.itemId });
			}
			//res.status(500).json({ pageTitle: thisItem.name});
		}).catch((e) => {
			let route = path.resolve(`static/404.html`);
			res.status(404).sendFile(route);
		});
	})

	router.post("/editItem/:itemId", isAuthenticated, (req, res, next) => {
		itemsData.getItemById(req.params.itemId)
			.then((thisItem) => {
				let name = req.body.name;
				let categories = req.body.categories.match(/[^,]+/g);
				let description = req.body.description;
				let price = parseFloat(req.body.price);
				let payment = req.body.paymentMethod;
				let zip = req.body.zip;
				let filename;
				let time = {
					minDays: parseFloat(req.body.minDays),
					maxDays: parseFloat(req.body.maxDays)
				};
				let status = req.body.status;

				if (isNaN(price) || isNaN(time.minDays) || isNaN(time.maxDays)) {
					res.render("layouts/accountItemEdit", { pageTitle: thisItem.name, itemProfile: thisItem, passedId: req.params.itemId, error: "Please complete all fields" });
					return;
				}
				if (!name || !categories || !description || isNaN(price) || !payment || !zip || isNaN(time.minDays) || isNaN(time.maxDays) || !status) {
					res.render("layouts/accountItemEdit", { pageTitle: thisItem.name, itemProfile: thisItem, passedId: req.params.itemId, error: "Please complete all fields" });
					return;
				}

				let updatedItem = {};
				if (req.file) {
					updatedItem.imagePath = "/public/uploads/" + req.file.filename;
				}
				updatedItem.name = name;
				updatedItem.categories = categories;
				updatedItem.description = description;
				updatedItem.price = price;
				updatedItem.payment = payment;
				updatedItem.zip = zip;
				updatedItem.time = time;
				updatedItem.status = status;

				itemsData.updateItem(req.params.itemId, updatedItem)
					.then((newItemProfile) => {
						res.render("layouts/accountItemEdit", { pageTitle: newItemProfile.name, itemProfile: newItemProfile });
					}).catch((e) => {
						res.status(500).json({ error: e });
					})
			})
			.catch((e) => {
				res.status(500).json({ error: e })
			})
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
