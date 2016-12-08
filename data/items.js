const mongoCollections = require('../config/mongoCollections');
const items = mongoCollections.items;
const user = require('./users');
const uuid = require('node-uuid');

let exportedMethods = {
    getAllItems() {
        return items().then((itemsCollection) => {
            return itemsCollection.find({}).toArray();
        })
    },

    getItemById(id) {
        if (!id) return Promise.reject("Please supply an item id");
        return items().then((itemsCollection) => {
            return itemsCollection.findOne({ _id: id })
                .then((item) => {
                    if (!item) {
                        return Promise.reject(`Item with ID ${id} not found`);
                    }
                    else {
                        return item;
                    }

                })
        })
    },

    getItemsForUserProfileId(userId) {
        if (!userId) return Promise.reject("Please supply a user id");
        return items().then((itemsCollection) => {
            return itemsCollection.find({ "userProfile._id": userId }).toArray();
        })
    },

    getItemsForUsername(username) {
        if (!username) return Promise.reject("Please supply a user name");
        return items().then((itemsCollection) => {
            return itemsCollection.find({ "userProfile.username": username }).toArray();
        })
    },

    addItem(userProfile, name, categories, description, price, paymentMethod, zip, imagePath, time, status) {
        if (!userProfile) return Promise.reject("No user profile specified");
        if (!name) return Promise.reject("No name specified");
        if (!categories) return Promise.reject("No categories specified");
        if (!description) return Promise.reject("No description specified");
        if (!price) return Promise.reject("No price specified");
        if (!paymentMethod) return Promise.reject("No payment method specified");
        if (!zip) return Promise.reject("No geographical area specified");
        if (!imagePath) return Promise.reject("No image path specified");
        if (!time) return Promise.reject("No time specified");
        if (!status) return Promise.reject("No status specified");

        return items().then((itemsCollection) => {
            let newItem = {
                _id: uuid.v4(),
                userProfile: userProfile,
                name: name,
                categories: categories,
                description: description,
                price: price,
                paymentMethod: paymentMethod,
                zip: zip,
                imagePath: imagePath,
                time: time,
                rentals: [],
                status: status
            }
            return itemsCollection.insertOne(newItem)
                .then((newInsertInformation) => {
                    return newInsertInformation.insertedId;
                })
                .then((newId) => {
                    return this.getItemById(newId);
                })
        })
    },

    updateItem(id, updatedItem) {
        return items().then((itemsCollection) => {
            let updatedItemData = {};

            if (updatedItem.name) {
                updatedItemData.name = updatedItem.name;
            }
            if (updatedItem.category) {
                updatedItemData.categories = updatedItem.category;
            }
            if (updatedItem.description) {
                updatedItemData.description = updatedItem.description;
            }
            if (updatedItem.price) {
                updatedItemData.price = updatedItem.price;
            }
            if (updatedItem.paymentMethod) {
                updatedItemData.paymentMethod = updatedItem.paymentMethod;
            }
            if (updatedItem.zip) {
                updatedItemData.zip = updatedItem.zip;
            }
            if (updatedItem.imagePath) {
                updatedItemData.imagePath = updatedItem.imagePath;
            }
            if (updatedItem.time) {
                updatedItemData.time = updatedItem.time;
            }
            if (updatedItem.rentals) {
                updatedItemData.rentals = updatedItem.rentals;
            }
            if (updatedItem.status) {
                updatedItemData.status = updatedItem.status;
            }

            let updateCommand = {
                $set: updatedItemData
            }

            return itemsCollection.updateOne({
                _id: id
            }, updateCommand)
                .then((result) => {
                    return this.getItemById(id);
                });
        });
    },

    addRental(id, userProfile, start, end) {
        if (!id) return Promise.reject("No id specified");
        if (!userProfile) return Promise.reject("No user profile specified");
        if (!start) return Promise.reject("No start specified");
        if (!end) return Promise.reject("No end specified")
        return items().then((itemsCollection) => {
            let rentalItem = {
                _id: uuid.v4(),
                userProfile: userProfile,
                start: start,
                end: end
            }
            return itemsCollection.update({ _id: id }, { $push: { rentals: rentalItem } })
                .then(() => {
                    return this.getItemById(id);
                })
        })
    },

    advancedSearch(searchProperties) {
        let validSearchProperties = {};
        if (searchProperties.username) {
            validSearchProperties.userProfile.username = searchProperties.username;
        }
        if (searchProperties.name) {
            validSearchProperties.name = searchProperties.name;
        }
        if (searchProperties.categories) {
            validSearchProperties.categories = searchProperties.categories
        }
        if (searchProperties.minPrice && searchProperties.maxPrice) {
            validSearchProperties.price = { $lte: searchProperties.maxPrice, $gte: searchProperties.minPrice }
        }
        else if (searchProperties.minPrice) {
            validSearchProperties.price = { $gte: searchProperties.minPrice };
        }
        else if (searchProperties.maxPrice) {
            validSearchProperties.price = { $lte: searchProperties.maxPrice };
        }
        if (searchProperties.paymentMethod) {
            validSearchProperties.paymentMethod = searchProperties.PaymentMethod;
        }
        if (searchProperties.status) {
            validSearchProperties.status = searchProperties.status;
        }
        if (searchProperties.zip) {
            validSearchProperties.zip = searchProperties.zip;
        }
        return items().then((itemsCollection) => {
            return itemsCollection.find(validSearchProperties).toArray();
        })
    },

    deleteItem(id) {
        if (!id) return Promise.reject("No id specified");
        return items().then((itemsCollection) => {
            return itemsCollection.removeOne({ _id: id })
                .then((deletionInfo) => {
                    if (deletionInfo.deletedCount === 0) {
                        return Promise.reject(`Could not delete item with id of ${id}`);
                    }
                    else {
                        return Promise.resolve(`Deleted item with id of ${id}`);
                    }
                })
        })
    },

    searchByKeyword(theString) {
        if(!theString) return Promise.reject("No word specified");
        return items().then((itemsCollection) => {
            itemsCollection.createIndex({ description: "text" });
            return itemsCollection.find({ $text: { $search: theString } }).toArray();
        })
    }
}

module.exports = exportedMethods;