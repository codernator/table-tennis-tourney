var TpPromise = require("promise");

module.exports = (function () {
    "use strict";
    var cachedModel = null,
        mongoose,
        uri,
        uriUtil = require('mongodb-uri');

    function model(name, schema) {
        var db;
        
        if (!cachedModel) {
            db = mongoose.createConnection(uri);
            cachedModel = db.model(name, mongoose.Schema(schema));
        }
        return cachedModel;
    }

    function createConnection() {
        return mongoose.createConnection(uri);
    }

    return {
        init: function (mymongoose, mongodb) {
            mongoose = mymongoose;
            uri = "mongodb://" + mongodb.DbUser + ":" + mongodb.Password + "@" + mongodb.Uri;
            return this;
        },
        model: model,
        createConnection: createConnection
    };
}());
