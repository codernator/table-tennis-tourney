module.exports = function (dataProvider) {
    "use strict";
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
            department = dataProvider.departments.getInterface(request.user.id).get(id),
            translated;

        translated = translate(department);
        response.send(translated);
    }
    
    function list (request, response) {
        var params = request.params,
            departments = dataProvider.departments.getInterface(request.user.id).list(),
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
