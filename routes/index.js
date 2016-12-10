const usersRoutes = require("./users");
const itemsRoutes = require("./items");
const data = require("../data");
const path = require("path");

const constructorMethod = (app, passport) => {
	const accRoutes = require("./accounts")(passport);
	app.use("/users", usersRoutes);
	app.use("/items", itemsRoutes);
	app.use("/account", accRoutes);

	app.get("/", (req, res) => {
		res.render("layouts/home", {});
	});

	app.use("*", (req, res) => {
		let route = path.resolve(`static/404.html`);
		res.status(404).sendFile(route);
	});
};

module.exports = constructorMethod;
