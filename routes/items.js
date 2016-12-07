const express = require("express");
const router = express.Router();
const data = require("../data");
const usersData = data.users;
const itemsData = data.items;
const uuid = require('node-uuid');
const fs = require('fs');

router.get("/", (req, res) => {
	itemsData.getAllItems().then((itemsArray) => {
		res.render("layouts/items", { pageTitle: "List of All Items", itemsArray: itemsArray });
	}).catch((e) => {
		res.status(500).json({ error: e });
	});
});

router.get('/advanced', (req, res) => {
	res.render('layouts/advanced');
});

router.post('/advanced', function (req, res) {
	const keywords = req.body.keywords;
	const category = req.body.category;
	const minPrice = req.body.minPrice;
	const maxPrice = req.body.maxPrice;
	const payment = req.body.paymentmethod;
	const zipcode = req.body.zipcode;
	const time = req.body.time;
	const availability = req.body.availability;

	//advanced search with no fields filled in
	if (!keywords && !category && !minPrice && !maxPrice && !payment && !zipcode && !time && !availability) {
		res.redirect('/items');
	}
	//advanced search with only category field filled
	if (!keywords && category && !minPrice && !maxPrice && !payment && !zipcode && !time && !availability) {
		res.redirect('/items/categories/' + category);
	}
	//advanced search with min price filled in
	if (!keywords && !category && minPrice && !maxPrice && !payment && !zipcode && !time && !availability) {
		res.redirect('/items/price/' + minPrice + "/100000");
	}
	//advanced search with max price filled in
	if (!keywords && !category && !minPrice && maxPrice && !payment && !zipcode && !time && !availability) {
		res.redirect('/items/price/0/' + maxPrice);
	}
	//advanced search with min & max price filled in
	if (!keywords && !category && minPrice && maxPrice && !payment && !zipcode && !time && !availability) {
		res.redirect('/items/price/' + minPrice + "/" + maxPrice);
	}
	//advanced search by payment method
	if (!keywords && !category && !minPrice && !maxPrice && payment && !zipcode && !time && !availability) {
		res.redirect('/items'); //TODO
	}
	//advanced search by zip
	if (!keywords && !category && !minPrice && !maxPrice && !payment && zipcode && !time && !availability) {
		res.redirect('/items/zip/' + zipcode);
	}
	//advanced search by time
	if (!keywords && !category && !minPrice && !maxPrice && !payment && !zipcode && time && !availability) {
		res.redirect('/items/time/' + time);
	}
	//advanced search by availability
	if (!keywords && !category && !minPrice && !maxPrice && !payment && !zipcode && !time && availability) {
		res.redirect('/items/status/' + availability);
	}
	else {
		// TODO: generate query object with all parameters
		let itemsArray = items.advancedSearch()
		res.render("layouts/items", { pageTitle: "List of All Items", itemsArray: itemsArray });
	}
});

router.get("/:id", (req, res) => {
	itemsData.getItemById(req.params.id).then((thisItem) => {
		res.render("layouts/items", { pageTitle: thisItem.name, itemProfile: thisItem });
	}).catch((e) => {
		res.status(500).json({ error: e });
	});
});

router.get("/categories/:category", (req, res) => {
	itemsData.getAllItems().then((itemsArray) => {
		let newArray = [];
		for (var x in itemsArray) {
			for (var y in itemsArray[x].categories) {
				if (itemsArray[x].categories[y] == req.params.category) {
					newArray.push(itemsArray[x]);
				}
			}
		}
		res.render("layouts/items", { pageTitle: "Showing items with category '" + req.params.category + "'", itemsArray: newArray, button: 1 });
	}).catch((e) => {
		res.status(500).json({ error: e });
	});
});

router.get("/zip/:zip", (req, res) => {
	itemsData.getAllItems().then((itemsArray) => {
		let newArray = [];
		for (var x in itemsArray) {
			if (itemsArray[x].zip == req.params.zip) {
				newArray.push(itemsArray[x]);
			}
		}
		res.render("layouts/items", { pageTitle: "Showing items with zip code '" + req.params.zip + "'", itemsArray: newArray, button: 1 });
	}).catch((e) => {
		res.status(500).json({ error: e });
	});
});

router.get("/time/:time", (req, res) => {
	itemsData.getAllItems().then((itemsArray) => {
		let newArray = [];
		for (var x in itemsArray) {
			if (itemsArray[x].time.maxDays >= req.params.time) {
				newArray.push(itemsArray[x]);
			}
		}
		res.render("layouts/items", { pageTitle: "Showing items that can be taken out at least " + req.params.time + " days", itemsArray: newArray, button: 1 });
	}).catch((e) => {
		res.status(500).json({ error: e });
	});
});

//takes in the userid, not the user profile id
router.get("/user/:userid", (req, res) => {
	usersData.getUserById(req.params.userid).then((thisUser) => {
		let userProfileId = thisUser.userProfile._id;
		itemsData.getItemsForUserProfileId(userProfileId).then((itemsArray) => {
			res.render("layouts/items", { pageTitle: "Items posted by " + thisUser.userProfile.username, itemsArray: itemsArray, button: 1 });
		});
	}).catch((e) => {
		res.status(500).json({ error: e });
	});
});

router.get("/user/username/:username", (req, res) => {
	usersData.getUserByUsername(req.params.username).then((thisUser) => {
		let userProfileId = thisUser.userProfile._id;
		itemsData.getItemsForUserProfileId(userProfileId).then((itemsArray) => {
			res.render("layouts/items", { pageTitle: "Items posted by " + req.params.username, itemsArray: itemsArray, button: 1 });
		});
	}).catch((e) => {
		res.status(500).json({ error: e });
	});
});

router.get("/status/:status", (req, res) => {
	itemsData.getAllItems().then((itemsArray) => {
		let newArray = [];
		for (var x in itemsArray) {
			if (itemsArray[x].status == req.params.status) {
				newArray.push(itemsArray[x]);
			}
		}
		res.render("layouts/items", { pageTitle: "Showing items with status '" + req.params.status + "'", itemsArray: newArray, button: 1 });
	}).catch((e) => {
		res.status(500).json({ error: e });
	});
});

router.get("/price/:min/:max", (req, res) => {
	itemsData.getAllItems().then((itemsArray) => {
		let newArray = [];
		for (var x in itemsArray) {
			if (itemsArray[x].price >= req.params.min && itemsArray[x].price <= req.params.max) {
				newArray.push(itemsArray[x]);
			}
		}
		res.render("layouts/items", { pageTitle: "Showing items with price within [" + req.params.min + ", " + req.params.max + "]", itemsArray: newArray, button: 1 });
	}).catch((e) => {
		res.status(500).json({ error: e });
	});
});

router.get("/new/:userid", (req, res) => {
	res.render("layouts/form_item", { pageTitle: "Create a new item!" });
});

router.post("/new/:userid", (req, res) => {
	let name = req.body.name;
	let categories = req.body.categories.match(/[^,]+/g);
	console.log(categories);
	let description = req.body.description;
	let price = parseInt(req.body.price);
	let payment = req.body.paymentMethod;
	let geo = req.body.zip;
	let imagePath = req.files.photo.path;
	let time = {
		minDays: parseInt(req.body.minDays),
		maxDays: parseInt(req.body.maxDays)
	};
	let status = "available";

	let fileExt = imagePath.split('.').pop();
	let imageID = uuid.v4();

	fs.readFile(imagePath, function (err, data) {
		let newPath = __dirname + "/public/uploads/" + imageID + "." + fileExt;
		fs.writeFile(newPath, data, function (err) {
			usersData.getUserById(req.params.userid).then((thisUser) => {
				let userProfile = thisUser.userProfile;
				try {
					itemsData.addItem(userProfile, name, categories, description, price, payment, geo, newPath, time, status).then((newItem) => {
						res.render("layouts/items", { pageTitle: name, itemProfile: newItem })
					});
				} catch (e) {
					res.render("layouts/form_item", { pageTitle: "ERROR!", error: e });
				}
			}).catch((e) => {
				res.render("layouts/form_item", { pageTitle: "Create a new item!", name: name, categories: categories, description: description, price: price, payment: payment, zip: geo.zip, radius: geo.radius, imagePath: imagePath, minDays: time.minDays, maxDays: time.maxDays, error: e });
				return;
			});
		})
	})
});

router.put("/:userid/:id", (req, res) => {
	let updatedItem = req.body;
	itemsData.updateItem(req.params.id, updatedItem).then((newItemProfile) => {
		res.render("layouts/items", { pageTitle: newItemProfile.name, itemProfile: newItemProfile });
	}).catch((e) => {
		res.status(500).json({ error: e });
	});
});

router.delete("/:id", (req, res) => {
	itemsData.deleteItem(req.params.id).then(() => {
		res.sendStatus(200);
	}).catch((e) => {
		res.status(500).json({ error: e });
	});
});

module.exports = router;
