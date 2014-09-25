var Promise = require("promise"),
    mongooseModule = require("./mongoose-module");

module.exports = function (organizationKey, mongoose, mongodb) {
    "use strict";
    var Model = mongooseModule.init(mongoose, mongodb).model("Department", {
            departmentKey: Number,
            organizationKey: Number,
            name: String,
            auditUserId: String
        }),
        uriUtil = require('mongodb-uri'),
        departments;

    function get(audit, departmentKey) {
        return new Promise(function (resolve, reject) {
            var cc = departments.length,
                model;

            if (departmentKey > 0) {
                while (cc-- > 0) {
                    model = departments[cc];
                    if (model.departmentKey === departmentKey) {
                        resolve(model);
                        return;
                    }
                }
            }

            resolve(new Model({
                departmentKey: 0,
                name: "None"
            }));
        });
    }

    function list(audit) {
        return new Promise(function (resolve, reject) {
            resolve(departments);
        });
    }

    function initModel(audit, departmentKey, name) {
        return new Model({
            departmentKey: departmentKey,
            name: name,
            organizationKey: organizationKey,
            auditUserId: audit.userId
        });
    }

    function create(audit, departmentKey, name) {
        return new Promise(function (resolve, reject) {
            var model = initModel(audit, departmentKey, name);
            //save
            resolve(model);
        });
    }

    return {
        getInterface: function (auditUserId) {
            var audit = { userId: auditUserId };

            /* TEMP */
            departments = [
                initModel(audit, 1, "BD PQD"),
                initModel(audit, 2, "BD Support"),
                initModel(audit, 3, "Axys Support")
            ];

            return {
                get: function (departmentKey) { return get(audit, departmentKey); },
                list: function () { return list(audit); },
                create: function (departmentKey, name) { return create(audit, departmentKey, name); }
            };
        }
    };
};
