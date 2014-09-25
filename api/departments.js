var module_model = null;
function createModel(mongoose) {
    "use strict";
    if (!module_model) {
        module_model = mongoose.model("Department", mongoose.Schema({
                departmentKey: Number,
                organizationKey: Number,
                name: String,
                auditUserId: String
            }));
    }
    
    return module_model;
}

module.exports = function (organizationKey, mongoose, mongodb) {
    "use strict";
    var Model = createModel(mongoose),
        departments;

    function get(audit, departmentKey) {
        var cc = departments.length,
            dd;

        while (cc-- > 0) {
            dd = departments[cc];
            if (dd.departmentKey === departmentKey) {
                return dd;
            }
        }
        
        var model = new Model();
        model.departmentKey = 0;
        model.name = "Unknown";
        return model;
    }

    function list(audit) {
        return departments;
    }

    function create(audit, departmentKey, name) {
        var model = new Model();
        model.departmentKey = departmentKey;
        model.name = name;
        model.organizationKey = organizationKey;
        model.auditUserId = audit.userId;
        return model;
    }

    return {
        getInterface: function(auditUserId) {
            var audit = { userId: auditUserId };

            /* TEMP */
            departments = [
                create (audit, 1, "BD PQD"),
                create (audit, 2, "BD Support"),
                create (audit, 3, "Axys Support")
            ];
            
            return {
                get: function (departmentKey) { return get(audit, departmentKey); },
                list: function () { return list(audit); },
                create: function (departmentKey, name) {
                    return create(audit, departmentKey, name);
                }
            };
        }
    };
};
