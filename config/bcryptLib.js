const bcrypt = require('bcrypt-nodejs');

let asyncPasswordHash = (plainTextPassword) => {
    if (!plainTextPassword) return Promise.reject("No password provided");
    return new Promise((resolve, reject) => {
        bcrypt.hash(plainTextPassword, null, null, (error, hash) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(hash);
            }
        })
    })
}

let comparePassword = (user, password) => {
    if (!user) return Promise.reject("No user specified");
    if (!password) return Promise.reject("No password specified");
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.hashedPassword, (error, res) => {
            if (res === true) {
                resolve(resolve);
            }
            else {
                reject(error);
            }
        })
    })
}

module.exports = {
    asyncPasswordHash: asyncPasswordHash,
    comparePassword: comparePassword
}