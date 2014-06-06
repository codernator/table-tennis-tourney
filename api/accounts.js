module.exports = function (mongoose) {
    "use strict";
    var accountSchema = mongoose.Schema({
            accountKey: Number,
            authenticator: String,
            authUserId: Number,
            organizationId: Number,
            fullName: String,
            since: Date,
            auditUserId: Number
        }),
        Model = mongoose.model("Account", accountSchema);

    function get(audit, authUserId) {
        if (!authUserId) {
            return null;
        }

        return new Model({
            authenticator: "None",
            authUserId: authUserId,
            fullName: "Unknown",
            since: new Date()
        });
    }

    function list(audit) {
    }

    function create(audit, authenticator, authUserId, fullName) {
        var model = new Model({
            authenticator: authenticator,
            authUserId: authUserId,
            organizationId: audit.organizationId,
            fullName: fullName,
            since: new Date(),
            auditUserId: audit.userId
        });
        
        return model;
    }

    function listByRole(audit, role) {
    }

    function authorize(audit, authenticator, authUserId) {
    }


    return {
        getInterface: function(auditOrganizationId, auditUserId) {
            var audit = { organizationId: auditOrganizationId, userId: auditUserId };

            return {
                get: function (authUserId) { return get(audit, authUserId); },
                list: function () { return list(audit); },
                create: function (authenticator, authUserId, fullName) {
                    return create(audit, authenticator, authUserId, fullName);
                },
                listByRole: function (role) { return listByRole(audit, role); },
                authorize: function (authenticator, authUserId) { return authorize(audit, authenticator, authUserId); }
            };
        }
    };
};
