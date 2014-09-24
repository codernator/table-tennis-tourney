var module_model = null;
function createModel(mongoose) {
    "use strict";
    if (!module_model) {
        module_model = mongoose.model("Profile", mongoose.Schema({
                profileKey: Number,
                gender: String,
                departmentKey: Number,
                locationKey: Number,
                since: Date,
                auditUserId: Number
            }));
    }
    
    return module_model;
}


module.exports = function (mongoose) {
    "use strict";
    var Model = createModel(mongoose);

    function get(audit, profileKey) {
        var model = new Model();
        model.profileKey = 0;
        return model;
    }

    function create(audit, gender, departmentKey, locationKey) {
        var model = new Model();
        model.profileKey = 1;
        model.gender = gender;
        model.departmentKey = departmentKey;
        model.locationKey = locationKey;
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
        getInterface: function(auditOrganizationId, auditUserId) {
            var audit = { organizationId: auditOrganizationId, userId: auditUserId };

            return {
                get: function (profileKey) { return get(audit, profileKey); },
                list: function () { return list(audit); },
                create: function (gender, departmentKey, locationKey) {
                    return create(audit, gender, departmentKey, locationKey);
                },
                listByRole: function (role) { return listByRole(audit, role); }
            };
        }
    };
};
