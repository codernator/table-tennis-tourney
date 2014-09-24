module.exports = function (organizationId, dataProvider) {
    "use strict";
    var accountsApi = require("../../api/accounts.js")(dataProvider),
        profilesApi = require("../../api/profiles.js")(dataProvider),
        departmentsApi = require("../../api/departments.js")(dataProvider);

    function translate(account, auditUserId) {
        var profile = profilesApi.getInterface(organizationId, auditUserId).get(account.profileKey),
            department = departmentsApi.getInterface(organizationId, auditUserId).get(account.departmentKey);

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
    
    function get (request, response) {
        var params = request.params,
            id = params.id,
            auditUser = request.user,
            auditUserId = auditUser.id,
            iface = accountsApi.getInterface(organizationId, auditUserId),
            account = iface.get(id),
            profile;

        if (!account) {
            console.log({"Create":auditUserId});
            account = iface.create("Google", auditUserId);
        }

        response.send(translate(account, auditUserId));
    }

    return {
        get: get
    };
};
