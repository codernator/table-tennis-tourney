var errorHandler = require("./error-handler");

module.exports = function (dataProvider) {
    "use strict";
    function translate(account, profile, department, auditUserId) {
        var model = {
            accountKey: account.accountKey,
            since: account.since,
            profile: {
                profileKey: profile.profileKey,
                gender: profile.gender,
                department: { "departmentKey": department.departmentKey, "name": department.Name },
                location: { "locationKey": 0, "name": "TODO" }
            }
        };

        if (auditUserId === account.authUserId) {
            // protected fields.
            // SECURITY MODEL will also include these fields when audit user has proper permissions.
            model.authUserId = account.authUserId;
            model.authenticator = account.authenticator;
        }

        return model;
    }

    function get(request, response) {
        var params = request.params,
            id = params.id,
            auditUserId = request.user.id,
            iface = dataProvider.accounts.getInterface(auditUserId),
            handleError = errorHandler.get(request, response);

        if (!id) {
            id = auditUserId; // looking at my own profile.
        }

        console.log("Getting account", id);
        iface.get(id).then(function (account) {
            if (!account) {
                console.log("Account Not found.");
                handleError(new Error("Unknown account."));
            }

            console.log("Account found. Loading profile.");
            dataProvider.profiles.getInterface(auditUserId).get(account.profileKey).then(function (profile) {
                console.log("Profile found. Loading meta data.");
                dataProvider.departments.getInterface(auditUserId).get(profile.departmentKey).then(function (department) {
                    console.log("Sending response.");
                    response.send(translate(account, profile, department, auditUserId));
                }, handleError);
            }, handleError);
        }, handleError);
    }

    function put(request, response) {
        var params = request.params,
            id = params.id,
            auditUserId = request.user.id,
            accountFace = dataProvider.accounts.getInterface(auditUserId),
            profileFace = dataProvider.profiles.getInterface(auditUserId),
            handleError = errorHandler.get(request, response),
            
            gender = request.body.gender,
            department = request.body.department,
            location = request.body.location;

        if (!id) {
            id = auditUserId;
        }

        console.log("Getting account.", id);
        accountFace.get(id).then(function (account) {
            if (!account) {
                console.log("Account not found, creating profile.");
                profileFace.put(null, gender, department, location).then(function(profile) {
                    console.log("Profile created. Creating account.");
                    accountFace.create("Google", auditUserId, profile._id).then(function (account) {
                        console.log("Account created. Fetching meta data.");
                        dataProvider.departments.getInterface(auditUserId).get(profile.departmentKey).then(function (department) {
                            console.log("Sending response.");
                            response.send(translate(account, profile, department, auditUserId));
                        }, handleError);
                    }, handleError);
                });
            } else {
                console.log("Updating profile.");
                profileFace.put(account.profileKey, gender, department, location).then(function (profile) {
                    console.log("Profile updated. Fetching meta data.");
                    dataProvider.departments.getInterface(auditUserId).get(profile.departmentKey).then(function (department) {
                        console.log("Sending response.");
                        response.send(translate(account, profile, department, auditUserId));
                    }, handleError);
                }, handleError);
            }
       }, handleError);
    }

    return {
        get: get,
        put: put
    };
};
