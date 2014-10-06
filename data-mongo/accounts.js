var TpPromise = require("promise"),
    mongooseModule = require("./mongoose-module");

module.exports = function (organizationKey, mongoose, mongodb) {
    "use strict";
    var Model = mongooseModule.init(mongoose, mongodb).model("Account", {
            accountKey: Number,
            authenticator: String,
            authUserId: String,
            organizationKey: mongoose.Schema.Types.ObjectId,
            profileKey: mongoose.Schema.Types.ObjectId,
            since: Date,
            auditUserId: Number
        });

    function get(audit, authUserId) {
        return new TpPromise(function (resolve, reject) {
            if (!authUserId) {
                console.log("No ID");
                resolve(null);
            }

            console.log("Connecting...");
            var db = mongooseModule.createConnection();
            console.log("Finding");
            Model.findOne({ authUserId: authUserId }).exec(function (error, user) {
                console.log("Done. Closing.");
                db.close();
                if (error) {
                    console.log("Rejecting on error.", error);
                    reject(new Error(error));
                } else {
                    console.log("Resolving on user.", user);
                    resolve(user); // expect user to be null if not yet in database.
                }
            });
        });
    }

    function create(audit, authenticator, authUserId, profileKey) {
        return new TpPromise(function (resolve, reject) {
            var db,
                model;

            try {
                db = mongooseModule.createConnection();
                model = new Model({
                    authenticator: authenticator,
                    authUserId: authUserId,
                    organizationKey: organizationKey,
                    profileKey: profileKey,
                    since: new Date(),
                    auditUserId: audit.userId
                });
                model.save();
                resolve(model);
            } catch (error) {
                reject(new Error(error));
            } finally {
                db.close();
            }
        });
    }

    function listByRole(audit, role) {
        return new TpPromise(function (resolve, reject) {
            resolve([]);
        });
    }


    return {
        getInterface: function (auditUserId) {
            var audit = { userId: auditUserId };

            return {
                get: function (authUserId) { return get(audit, authUserId); },
                create: function (authenticator, authUserId, profileKey) { return create(audit, authenticator, authUserId, profileKey); },
                listByRole: function (role) { return listByRole(audit, role); }
            };
        }
    };
};
