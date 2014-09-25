var module_model = null;
function createModel(mongoose) {
    "use strict";
    if (!module_model) {
        module_model = mongoose.model("Account", mongoose.Schema({
                accountKey: Number,
                authenticator: String,
                authUserId: String,
                organizationKey: Number,
                profileKey: Number,
                since: Date,
                auditUserId: Number
            }));
    }
    
    return module_model;
}

module.exports = function (organizationKey, mongoose, mongodb) {
    "use strict";
    var Model = createModel(mongoose);

    function get(audit, authUserId) {
        if (!authUserId) {
            return null;
        }

        var model = new Model();
        model.authenticator = "None";
        model.authUserId = authUserId;
        model.since = new Date();
        return model;
    }

    function create(audit, authenticator, authUserId) {
        var model = new Model();
        model.accountKey = 1;
        model.authenticator = authenticator;
        model.authUserId = authUserId;
        model.organizationKey = organizationKey;
        model.profileKey = 0;
        model.since = new Date();
        model.auditUserId = audit.userId;
        return model;
    }

    function list(audit) {
        return [];
    }

    function listByRole(audit, role) {
        return [];
    }


    return {
        getInterface: function(auditUserId) {
            var audit = { userId: auditUserId };

            return {
                get: function (authUserId) { return get(audit, authUserId); },
                list: function () { return list(audit); },
                create: function (authenticator, authUserId) {
                    return create(audit, authenticator, authUserId);
                },
                listByRole: function (role) { return listByRole(audit, role); }
            };
        }
    };
};
