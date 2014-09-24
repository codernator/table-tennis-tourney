module.exports = function (organizationId, dataProvider) {
    "use strict";
    var api = require("../../api/departments.js")(dataProvider);

    function translate(department) {
        var model = {
            departmentKey: department.departmentKey,
            name: department.Name
        };

        return model;
    }
    
    function get (request, response) {
        var params = request.params,
            id = params.id,
            iface = api.getInterface(organizationId, request.user.id),
            department = iface.get(id),
            translated;

        translated = translate(department);
        response.send(translated);
    }
    
    function list (request, response) {
        var params = request.params,
            iface = api.getInterface(organizationId, request.user.id),
            departments = iface.list(),
            cc = departments.length,
            translated = [];

        while (cc-- > 0) {
            translated.push(translate(departments[cc]));
        }
        response.send(translated);
    }

    return {
        get: get,
        list: list
    };
};
