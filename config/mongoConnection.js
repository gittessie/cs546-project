const MongoClient = require("mongodb").MongoClient;

// TODO: select database name
const settings = {
    mongoConfig: {
        serverUrl: "mongodb://localhost:27017/",
        database: "finalProjectDb"
    }
};

let fullMongoUrl = settings.mongoConfig.serverUrl + settings.mongoConfig.database;
let _connection = undefined;

let connectDb = () => {
    if (!_connection) {
        _connection = MongoClient.connect(fullMongoUrl)
        .then((db) => {
            return db;
        });
    }
    return _connection;
};

module.exports = connectDb;