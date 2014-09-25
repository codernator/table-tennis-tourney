var Promise = require("promise"),
    errorHandler = require("./error-handler");

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
            account = iface.get(id);

        iface.get(id).then(function (account) {
            var step = !account
                ? iface.create("Google", auditUserId)
                : new Promise(function (resolve, reject) { resolve(account); });

            step.then(function (account) {
                dataProvider.profiles.getInterface(auditUserId).get(account.profileKey).then(function (profile) {
                    dataProvider.departments.getInterface(auditUserId).get(profile.departmentKey).then(function (department) {
                        response.send(translate(account, profile, auditUserId));
                    }, function (error) {
                        errorHandler.handle(request, response, error);
                    });
                }, function (error) {
                    errorHandler.handle(request, response, error);
                });
            }, function (error) {
                errorHandler.handle(request, response, error);
            });
        }, function (error) {
            errorHandler.handle(request, response, error);
        });
    }

    return {
        get: get
    };
};
