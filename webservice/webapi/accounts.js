module.exports = function (dataProvider) {
    "use strict";
    function translate(account, auditUserId) {
        var profile = dataProvider.profiles.getInterface(auditUserId).get(account.profileKey),
            department = dataProvider.departments.getInterface(auditUserId).get(account.departmentKey);

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
            iface = dataProvider.accounts.getInterface(auditUserId),
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
