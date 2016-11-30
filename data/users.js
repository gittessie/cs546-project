const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const uuid = require('node-uuid');
const bcryptLib = require('../config/bcryptLib');

let exportedMethods = {
    getAllUsers() {
        return users().then((userCollection) => {
            return userCollection.find({}).toArray();
        })
    },

    getUserById(id) {
        if (!id) return Promise.reject("Please supply an ID");
        return users().then((userCollection) => {
            return userCollection.findOne({ _id: id })
                .then((user) => {
                    if (!user) {
                        return Promise.reject(`User with ID ${id} not found`);
                    }
                    else {
                        return user;
                    }

                })
        })
    },

    getUserByProfileId(id) {
        if (!id) return Promise.reject("Please supply an id");
        return users().then((userCollection) => {
            return userCollection.findOne({ "userProfile._id": id })
                .then((user) => {
                    if (!user) {
                        return Promise.reject(`User with user profile ${id} not found`);
                    }
                    else {
                        return user;
                    }
                })
        })
    },

    getUserByEmail(email) {
        if (!email) return Promise.reject("Please supply an email address");
        return users().then((userCollection) => {
            return userCollection.findOne({ "userProfile.email": email })
                .then((user) => {
                    if (!user) {
                        return Promise.reject(`User with email ${email} does not exist`);
                    }
                    else {
                        return user;
                    }
                })
        })
    },

    getUserByUsername(username) {
        if (!username) return Promise.reject("Please supply a username");
        return users().then((userCollection) => {
            return userCollection.findOne({ "userProfile.username": username })
                .then((user) => {
                    if (!user) {
                        return Promise.reject(`User with username ${username} does not exist`);
                    }
                    else {
                        return user;
                    }
                })
        })
    },

    usernameAvailable(username) {
        if (!username) {
            return Promise.reject("No username specified");
        }
        return this.getUserByUsername(username)
            .then((user) => {
                return false;
            })
            .catch((err) => {
                if (err === `User with username ${username} does not exist`) {
                    return true;
                }
                else {
                    return Promise.reject(err);
                }
            })
    },

    emailAvailable(email) {
        if (!email) {
            return Promise.reject("No email specified");
        }
        return this.getUserByEmail(email)
            .then((user) => {
                return false;
            })
            .catch((err) => {
                if (err === `User with email ${email} does not exist`) {
                    return true;
                }
                else {
                    return Promise.reject(err);
                }
            })
    },

    addUser(username, password, firstName, lastName, email, phone, zip) {
        if (!username) return Promise.reject("No username specified");
        if (!password) return Promise.reject("No password specified");
        if (!firstName) return Promise.reject("No firstName specified");
        if (!lastName) return Promise.reject("No lastName specified");
        if (!email) return Promise.reject("No email specified");
        if (!phone) return Promise.reject("No phone specified");
        if (!zip) return Promise.reject("No zip specified");
        return users().then((userCollection) => {
            return bcryptLib.asyncPasswordHash(password)
                .then((hashedPassword) => {
                    let newUser = {
                        _id: uuid.v4(),
                        hashedPassword: hashedPassword,
                        userProfile: {
                            username: username,
                            firstName: firstName,
                            lastName: lastName,
                            email: email,
                            phone: phone,
                            zip: zip,
                            _id: uuid.v4()
                        }
                    }
                    return userCollection.insertOne(newUser)
                        .then((newInsertInformation) => {
                            return newInsertInformation.insertedId;
                        })
                        .then((newId) => {
                            return this.getUserById(newId);
                        })
                })
        })
    },

    updateUserProfile(id, updatedItem) {
        return users().then((userCollection) => {
            return this.getUserByProfileId(id)
                .then((user) => {
                    let updatedUserData = { userProfile: {} };

                    if (updatedItem.firstName) {
                        updatedUserData.userProfile.firstName = updatedItem.firstName;
                    }
                    else {
                        updatedUserData.userProfile.firstName = user.userProfile.firstName
                    }
                    if (updatedItem.lastName) {
                        updatedUserData.userProfile.lastName = updatedItem.lastName;
                    }
                    else {
                        updatedUserData.userProfile.lastName = user.userProfile.lastName;
                    }
                    if (updatedItem.email) {
                        updatedUserData.userProfile.email = updatedItem.email;
                    }
                    else {
                        updatedUserData.userProfile.email = user.userProfile.email;
                    }
                    if (updatedItem.zip) {
                        updatedUserData.userProfile.zip = updatedItem.zip;
                    }
                    else {
                        updatedUserData.userProfile.zip = user.userProfile.zip;
                    }
                    if (updatedItem.phone) {
                        updatedUserData.userProfile.phone = updatedItem.phone;
                    }
                    else {
                        updatedUserData.userProfile.phone = user.userProfile.phone;
                    }

                    updatedUserData.userProfile._id = user.userProfile._id;
                    updatedUserData.userProfile.username = user.userProfile.username;

                    let updateCommand = {
                        $set: updatedUserData
                    }
                    return userCollection.updateOne({
                        _id: user._id
                    }, updateCommand)
                        .then((result) => {
                            return this.getUserByProfileId(id);
                        })
                })
        })
    },

    updateUserPassword(id, newPassword) {
        return users().then((userCollection) => {
            return userCollection.updateOne({
                _id: id
            }, { $set: { hashedPassword: newPassword } })
                .then((result) => {
                    return this.getUserById(id);
                })
        })
    },

    deleteUser(id) {
        if (!id) return Promise.reject("No id specified");
        return users().then((userCollection) => {
            return userCollection.removeOne({ _id: id })
                .then((deletionInfo) => {
                    if (deletionInfo.deletedCount === 0) {
                        return Promise.reject(`Could not delete user with id of ${id}`);
                    }
                    else {
                        return Promise.resolve(`Deleted user with id of ${id}`)
                    }
                })
        })
    }
}

module.exports = exportedMethods;