var Promise = require("promise"),
    mongooseModule = require("./mongoose-module");

module.exports = function (organizationKey, mongoose, mongodb) {
    "use strict";
    var Model = mongooseModule.init(mongoose, mongodb).model("Account", {
            accountKey: Number,
            authenticator: String,
            authUserId: String,
            organizationKey: Number,
            profileKey: Number,
            since: Date,
            auditUserId: Number
        });

    function get(audit, authUserId) {
        return new Promise(function (resolve, reject) {
            if (!authUserId) {
                resolve(null);
            }

            /*temp*/
            var model = new Model({
                accountKey: 1,
                authenticator: "",
                authUserId: authUserId,
                organizationKey: organizationKey,
                profileKey: 0,
                since: new Date(),
                auditUserId: audit.userId
            });

            resolve(model);
        });
    }

    function create(audit, authenticator, authUserId) {
        return new Promise(function (resolve, reject) {
            var model = new Model({
                accountKey: 1, /*temp*/
                authenticator: authenticator,
                authUserId: authUserId,
                organizationKey: organizationKey,
                profileKey: 0,
                since: new Date(),
                auditUserId: audit.userId
            });
            resolve(model);
        });
    }

    function listByRole(audit, role) {
        return new Promise(function (resolve, reject) {
            resolve([]);
        });
    }


    return {
        getInterface: function (auditUserId) {
            var audit = { userId: auditUserId };

            return {
                get: function (authUserId) { return get(audit, authUserId); },
                create: function (authenticator, authUserId) { return create(audit, authenticator, authUserId); },
                listByRole: function (role) { return listByRole(audit, role); }
            };
        }
    };
};
