module.exports = (function () {
    "use strict";
    var cachedModel = null,
        mongoose,
        mongodb,
        uriUtil = require('mongodb-uri');

    function model(name, schema) {
        if (!cachedModel) {
            cachedModel = mongoose.model(name, mongoose.Schema(schema));
        }
        return cachedModel;
    }

    function connect() {
    }

    return {
        init: function (mymongoose, mymongodb) {
            mongoose = mymongoose;
            mongodb = mymongodb;
            return this;
        },
        model: model,
        connect: connect
    };
}());
