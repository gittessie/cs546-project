const dbConnection = require("./config/mongoConnection");
const data = require("./data/");
const users = data.users;
const items = data.items;

dbConnection().then((db) => {
	return db.dropDatabase().then(() => {
		return dbConnection;
	}).then((db) => {
		console.log("adding user");
		return users.addUser("clararamos", "password", "Clara", "Ramos", "cramos1@stevens.edu", "123-456-7809", "07030");
	}).then(() => {
		console.log("adding user");
		return users.addUser("allisonramos", "allisonspw", "Allison", "Ramos", "alliramos@gmail.com", "345-678-9998", "07030");
	}).then(() => {
		console.log("adding item to user clararamos");
		return users.getUserByUsername("clararamos").then((thisUser) => {
			let thisProfile = thisUser.userProfile;
			return items.addItem(thisProfile, "rice cooker", ["home", "appliances"], "a handy machine to cook rice without burning it", 10.00, "cash", "07030", "/public/uploads/ricecooker.jpg", { minDays: 0.5, maxDays: 2 }, "available");
		});
	}).then(() => {
		console.log("adding item to user clararamos");
		return users.getUserByUsername("clararamos").then((thisUser) => {
			let thisProfile = thisUser.userProfile;
			return items.addItem(thisProfile, "Wii U", ["appliances", "video_games", "electronics"], "A Nintendo Wii U", 30.00, "cash", "07030", "/public/uploads/wiiu.png", { minDays: 1, maxDays: 10 }, "available");
		});
	}).then(() => {
		console.log("adding item to user allisonramos");
		return users.getUserByUsername("allisonramos").then((thisUser) => {
			let thisProfile = thisUser.userProfile;
			return items.addItem(thisProfile, "Organic Chem Notes", ["tools"], "Notes from my Orgo class", 20.00, "cash", "07030", "/public/uploads/defaultItemIcon.jpg", { minDays: 1, maxDays: 21 }, "available");
		});
		}).then((db) => {
		  console.log("adding user");
		  return users.addUser("kirkviss", "password", "Kirk", "Viss", "kvisser@stevens.edu", "1234567809", "07030");
		}).then(() => {
		  console.log("adding item to user kirkviss");
		  return users.getUserByUsername("kirkviss").then((thisUser) => {
		    let thisProfile = thisUser.userProfile;
		    return items.addItem(thisProfile, "Lawn mower", ["outdoors"], "John Deer, barely used", 10.00, "cash", "07030", "/public/uploads/lawnmower.png", { minDays: 0.5, maxDays: 2 }, "available");
		  });
		}).then(() => {
		  return users.getUserByUsername("kirkviss").then((thisUser) => {
		    let thisProfile = thisUser.userProfile;
		    return items.addItem(thisProfile, "Xbox One", ["appliances", "video_games", "electronics", "toys_games"], "One year old xbox one, its sick", 40.00, "check", "07030", "/public/uploads/xboxone.png", { minDays: 1, maxDays: 10 }, "available");
		  });
		}).then(() => {
		  return users.getUserByUsername("kirkviss").then((thisUser) => {
		    let thisProfile = thisUser.userProfile;
		    return items.addItem(thisProfile, "PS4", ["appliances", "vide_ games", "electronics", "toys_games"], "Its also sick", 50.00, "check", "07030", "/public/uploads/PS4.png", { minDays: 1, maxDays: 10 }, "available");
		  });
		}).then(() => {
		  return users.getUserByUsername("kirkviss").then((thisUser) => {
		    let thisProfile = thisUser.userProfile;
		    return items.addItem(thisProfile, "TI-86 Graphing Calculator", ["electronics"], "Never used lol", 5.00, "cash", "07030", "/public/uploads/defaultItemIcon.jpg", { minDays: 1, maxDays: 100 }, "available");
			});
	}).then(() => {
		console.log("Done seeding database.");
		db.close();
		process.exit();
	});
}, (error) => {
    console.error(error);
});
