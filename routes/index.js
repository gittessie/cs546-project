const usersRoutes = require("./users");
//const itemsRoutes = require("./items");
//const newAccRoutes = require("./newAcc");
const data = require("../data");

const constructorMethod = (app) => {
	app.use("/users", usersRoutes);
	//app.use("/items", commentsRoutes);
	//app.use("/newaccount", newAccRoutes);

	app.get("/", (req, res) => {
		res.render("layouts/home", {});
	});

	app.use("*", (req, res) => {
		res.status(404).json({error: "Not found"});
	});
};

module.exports = constructorMethod;