var TpPromise = require("promise"),
    mongooseModule = require("./mongoose-module");

module.exports = function (organizationKey, mongoose, mongodb) {
    "use strict";
    var Model = mongooseModule.init(mongoose, mongodb).model("Profile", {
            profileKey: Number,
            gender: String,
            departmentKey: Number,
            locationKey: mongoose.Schema.Types.ObjectId,
            since: Date,
            organizationKey: mongoose.Schema.Types.ObjectId,
            auditUserId: String
        });

    function get(audit, id) {
        return new TpPromise(function (resolve, reject) {
            var db;
            try {
                db = mongooseModule.createConnection();

                Model.findById(id, function (error, model) {
                    if (error) {
                        reject(new Error(error));
                        return;
                    }
                    resolve (model);
                });
            } catch (error) {
                reject(new Error(error));
            } finally {
                db.close();
            }
        });
    }

    function put(audit, id, gender, departmentKey, locationKey) {
        return new TpPromise(function (resolve, reject) {
            var db, model;

            try {
                console.log("Connecting.");
                db = mongooseModule.createConnection();

                if (id) {
                    console.log("Finding");
                    Model.findByIdAndUpdate(id, function(error, data) {
                        if (error) {
                            console.log("Rejecting on error.");
                            reject(new Error(error));
                        } else {
                            data.gender = gender;
                            data.departmentKey = departmentKey;
                            data.locationKey = locationKey;
                            data.auditUserId = audit.userId;
                            data.save(function (saveError) {
                                if (saveError) {
                                    console.log("Rejecting on error.", saveError);
                                    reject(new Error(saveError));
                                } else {
                                    console.log("Resolving on data.", data);
                                    resolve(data);
                                }
                            });
                        }
                    });
                } else {
                    console.log("Creating");
                    model = new Model({
                        gender: gender,
                        departmentKey: departmentKey,
                        locationKey: locationKey,
                        since: new Date(),
                        organizationKey: organizationKey,
                        auditUserId: audit.userId
                    });

                    model.save(function (saveError) {
                        if (saveError) {
                            console.log("Rejecting on error.", saveError);
                            reject (new Error(saveError));
                        } else {
                            console.log("Resolving on profile.", model);
                            resolve(model);
                        }
                    });
                }
            } catch (error) {
                console.log("Rejecting on error.", error);
                reject(new Error(error));
            } finally {
                console.log("Closing.");
                db.close();
            }
        });
    }

    function list(audit) {
        return new TpPromise(function (resolve, reject) {
            resolve([]);
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
                get: function (id) { return get(audit, id); },
                list: function () { return list(audit); },
                put: function (id, gender, departmentKey, locationKey) { return put(audit, id, gender, departmentKey, locationKey); },
                listByRole: function (role) { return listByRole(audit, role); }
            };
        }
    };
};
