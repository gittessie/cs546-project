const usersRoutes = require("./users");
const itemsRoutes = require("./items");
const data = require("../data");
const path = require("path");
const usersData = data.users;
const itemData = data.items;

const constructorMethod = (app, passport) => {
	const accRoutes = require("./accounts")(passport);
	app.use("/users", usersRoutes);
	app.use("/items", itemsRoutes);
	app.use("/account", accRoutes);

	app.get("/", (req, res) => {
		if (req.user) {
				 usersData.getUserByUsername(req.user.userProfile.username).then((thisUser) => {
					let zipCode =thisUser.userProfile.zip;
					let resultsArray = [];
					itemData.getAllItems().then((itemsArray) =>{
						for (var x in itemsArray) {
							if (itemsArray[x].zip == zipCode) {
							 	resultsArray.push(itemsArray[x]);
							}
						}
						console.log("hit before trans");
						resultsArray = itemData.transformToGrid(resultsArray);
						res.render("layouts/home", {zip: zipCode, itemsArray: resultsArray});
					//  itemsData.transformToGrid(resultsArray).then((temp) => {
					 //
					// 	});
				});
			}).catch((e) => {
				res.status(500).json({ error: e });
			});
		}

		else{
			res.render("layouts/home", {help: "Login help"});
		}
	});

	app.use("*", (req, res) => {
		let route = path.resolve(`static/404.html`);
		res.status(404).sendFile(route);
	});
};

module.exports = constructorMethod;
