const dbConnection = require("./config/mongoConnection");
const data = require("./data/");
const users = data.users;
const items = data.items;

dbConnection().then((db) => {
    items.advancedSearch({ name: "rice cooker", categories: "appliances", price2: 50 })
        .then((items) => {
            console.log(items);
            db.close();
        })
})