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

router.get("/", (req, res) => {
	usersData.getAllUsers().then((usersArray) => {
		let idAndUsernameArray = usersArray.map(function (thisUser) {
			let a = {
				_id: thisUser._id,
				password: thisUser.hashedPassword,
				username: thisUser.userProfile.username
			};
			return a;
		});
		res.render("layouts/users", { pageTitle: "Users", usersArray: idAndUsernameArray, profile: req.body.userProfile }); //TODO need to figure out correct way to pass user profile???
	}).catch((e) => {
		res.status(500).json({ error: e });
	});
});

router.get("/search", (req, res) => {
	res.render("layouts/userSearch");
});

router.post('/search', function (req, res) {
	const username = req.body.username;
	const email = req.body.email;
	localError = "";

	if (!username && !email) {
		localError = "Please provide a search parameter."
		res.render("layouts/userSearch", { username: username, email: email, error: localError });
		return;
	}
	if (username) {
		usersData.getUserByUsername(username).then((thisUser) => {
			itemsData.getItemsForUsername(username).then((items) => {
				res.render("layouts/users", { pageTitle: thisUser.userProfile.username + "'s Profile", profile: thisUser.userProfile, itemsArray: items });
			})
		}).catch((e) => {
			//res.status(500).json({ error: e });
			res.render("layouts/userSearch", { username: username, error: e + ". Try searching for another user." });
		});
	}
	if (email) {
		usersData.getUserByEmail(email).then((thisUser) => {
			itemsData.getItemsForUsername(thisUser.userProfile.username).then((items) => {
				res.render("layouts/users", { pageTitle: thisUser.userProfile.username + "'s Profile", profile: thisUser.userProfile, itemsArray: items });
			})

		}).catch((e) => {
			//res.status(500).json({ error: e });
			res.render("layouts/userSearch", { email: email, error: e + ". Try searching for another user." });
		});
	}

});

router.get("/:id", (req, res) => {
	usersData.getUserById(req.params.id).then((thisUser) => {
		res.render("layouts/users", { pageTitle: thisUser.userProfile.username + "'s Profile", profile: thisUser.userProfile });
	}).catch((e) => {
		res.status(500).json({ error: e });
	});
});

router.get("/username/:username", (req, res) => {
	usersData.getUserByUsername(req.params.username).then((thisUser) => {
		let userProfileId = thisUser.userProfile._id;
		itemsData.getItemsForUserProfileId(userProfileId).then((itemsArray) => {
			res.render("layouts/users", { pageTitle: req.params.username + "'s Profile", itemsArray: itemsArray, id: thisUser._id, profile: thisUser.userProfile });
		});
		//res.render("layouts/users", { pageTitle: req.params.username + "'s Profile", profile: thisUser.userProfile });
	}).catch((e) => {
		res.status(500).json({ error: e });
	});
});

//takes in the userid, not the user profile id
router.get("/:id/items", (req, res) => {
	usersData.getUserById(req.params.id).then((thisUser) => {
		let userProfileId = thisUser.userProfile._id;
		itemsData.getItemsForUserProfileId(userProfileId).then((itemsArray) => {
			res.render("layouts/users", { pageTitle: thisUser.userProfile.username + "'s Items", itemsArray: itemsArray, id: req.params.id });
		});
	}).catch((e) => {
		res.status(500).json({ error: e });
	});
});

router.get("/username/:username/items", (req, res) => {
	usersData.getUserByUsername(req.params.username).then((thisUser) => {
		let userProfileId = thisUser.userProfile._id;
		itemsData.getItemsForUserProfileId(userProfileId).then((itemsArray) => {
			res.render("layouts/users", { pageTitle: req.params.username + "'s Items", itemsArray: itemsArray, id: thisUser._id });
		});
	}).catch((e) => {
		res.status(500).json({ error: e });
	});
});

router.put("/:id", (req, res) => {
	let updatedProfile = req.body;
	usersData.getUserById(req.params.id).then((thisUser) => {
		let profileID = thisUser.userProfile._id;
		usersData.updateUserProfile(profileID, updatedProfile.userProfile).then((newUserProfile) => {
			res.render("layouts/users", { pageTitle: thisUser.userProfile.username + "'s Profile", profile: newUserProfile.userProfile });
		});
	}).catch((e) => {
		res.status(500).json({ error: "Unable to update user with id " + req.params.id });
	});

});

router.put("/username/:username", (req, res) => {
	let updatedProfile = req.body;
	usersData.getUserByUsername(req.params.username).then((thisUser) => {
		let profileId = thisUser.userProfile._id;
		usersData.updateUserProfile(profileId, updatedProfile.userProfile).then((newUserProfile) => {
			res.render("layouts/users", { pageTitle: req.params.username + "'s Profile", profile: newUserProfile.userProfile });
		});
	}).catch((e) => {
		res.status(500).json({ error: "Unable to update user with username " + req.params.username });
	});
});

router.delete("/username/:username", (req, res) => {
	usersData.getUserByUsername(req.params.username).then((thisUser) => {
		usersData.deleteUser(thisUser._id).then(() => {
			res.Status(200).json({ message: "Deleted", redirect: "/" });
		});
	}).catch((e) => {
		res.status(500).json({ error: "Could not delete user" });
	});
});

module.exports = router;
