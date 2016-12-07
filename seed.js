const dbConnection = require("./config/mongoConnection");
const data = require("./data/");
const users = data.users;
const items = data.items;

dbConnection().then((db) => {
	return db.dropDatabase().then(() => {
		return dbConnection;
	}).then((db) => {
		console.log("adding user");
		return users.addUser("clararamos", "password", "Clara", "Ramos", "cramos1@stevens.edu", "1234567809", "07030");
	}).then(() => {
		console.log("adding user");
		return users.addUser("allisonramos", "allisonspw", "Allison", "Ramos", "alliramos@gmail.com", "3456789998", "07030");
	}).then(() => {
		console.log("adding item to user clararamos");
		return users.getUserByUsername("clararamos").then((thisUser) => {
			let thisProfile = thisUser.userProfile;
			return items.addItem(thisProfile, "rice cooker", ["kitchen", "appliances"], "a handy machine to cook rice without burning it", 10.00, "Cash", "07030", "C:/", { minDays: 0.5, maxDays: 2 }, "available");	
		});
	}).then(() => {
		console.log("adding item to user clararamos");
		return users.getUserByUsername("clararamos").then((thisUser) => {
			let thisProfile = thisUser.userProfile;
			return items.addItem(thisProfile, "Wii U", ["appliances", "video games", "entertainment"], "A Nintendo Wii U", 30.00, "Cash", "07030", "C:/", { minDays: 1, maxDays: 10 }, "available");
		});
	}).then(() => {
		console.log("adding item to user allisonramos");
		return users.getUserByUsername("allisonramos").then((thisUser) => {
			let thisProfile = thisUser.userProfile;
			return items.addItem(thisProfile, "Organic Chem Notes", ["school"], "Notes from my Orgo class", 20.00, "Cash", "07030", "C:/", { minDays: 1, maxDays: 21 }, "available");
		});
	}).then(() => {
		console.log("Done seeding database.");
		db.close();
	});
}, function(error) {
	console.error(error);
});