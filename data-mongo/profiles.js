var Promise = require("promise"),
    mongooseModule = require("./mongoose-module");

module.exports = function (organizationKey, mongoose, mongodb) {
    "use strict";
    var Model = mongooseModule.init(mongoose, mongodb).model("Profile", {
            profileKey: Number,
            gender: String,
            departmentKey: Number,
            locationKey: Number,
            since: Date,
            organizationKey: Number,
            auditUserId: String
        });

    function get(audit, profileKey) {
        return new Promise(function (resolve, reject) {
            var model = new Model();
            model.profileKey = 0;
            resolve(model);
        });
    }

    function create(audit, gender, departmentKey, locationKey) {
        return new Promise(function (resolve, reject) {
            var model = new Model();

            model.profileKey = 1;
            model.gender = gender;
            model.departmentKey = departmentKey;
            model.locationKey = locationKey;
            model.since = new Date();
            model.organizationKey = organizationKey;
            model.auditUserId = audit.userId;

            resolve(model);
        });
    }

    function list(audit) {
        return new Promise(function (resolve, reject) {
            resolve([]);
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
                get: function (profileKey) { return get(audit, profileKey); },
                list: function () { return list(audit); },
                create: function (gender, departmentKey, locationKey) { return create(audit, gender, departmentKey, locationKey); },
                listByRole: function (role) { return listByRole(audit, role); }
            };
        }
    };
};
