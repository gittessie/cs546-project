const express = require("express");
const router = express.Router();
const data = require("../data");
const usersData = data.users;
const itemsData = data.items;

router.get("/", (req, res) => {
	usersData.getAllUsers().then((usersArray) => {
		let idAndUsernameArray = usersArray.map(function(thisUser) {
			let a = {
				_id: thisUser._id,
				password: thisUser.hashedPassword,
				username: thisUser.userProfile.username
			};
			return a;
		});
		res.render("layouts/users", { pageTitle: "Lists of all Users", usersArray: idAndUsernameArray });
	}).catch((e) => {
		res.status(500).json({ error: e });
	});
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
		res.render("layouts/users", { pageTitle: req.params.username + "'s Profile", profile: thisUser.userProfile });
	}).catch((e) => {
		res.status(500).json({ error: e });
	});
});

//takes in the userid, not the user profile id
router.get("/:id/items", (req, res) => {
	usersData.getUserById(req.params.id).then((thisUser) => {
		let userProfileId = thisUser.userProfile._id;
		itemsData.getItemsForUserProfileId(userProfileId).then((itemsArray) => {
			res.render("layouts/users", { pageTitle: thisUser.userProfile.username + "'s Items", itemsArray: itemsArray });
		});
	}).catch((e) => {
		res.status(500).json({ error: e });
	});
});

router.get("/username/:username/items", (req, res) => {
	usersData.getUserByUsername(req.params.username).then((thisUser) => {
		let userProfileId = thisUser.userProfile._id;
		itemsData.getItemsForUserProfileId(userProfileId).then((itemsArray) => {
			res.render("layouts/users", { pageTitle: req.params.username + "'s Items", itemsArray: itemsArray });
		});
	}).catch((e) => {
		res.status(500).json({ error: e });
	});
});

module.exports = router;