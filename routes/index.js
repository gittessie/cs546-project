const usersRoutes = require("./users");
const itemsRoutes = require("./items");
const data = require("../data");

const constructorMethod = (app, passport) => {
	const accRoutes = require("./accounts")(passport);
	app.use("/users", usersRoutes);
	app.use("/items", itemsRoutes);
	app.use("/account", accRoutes);

	app.get("/", (req, res) => {
		res.render("layouts/home", {});
	});

	app.use("*", (req, res) => {
		res.status(404).json({error: "Not found"});
	});
};

module.exports = constructorMethod;
