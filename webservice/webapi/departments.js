var errorHandler = require("./error-handler");

module.exports = function (dataProvider) {
    "use strict";
    function translate(department) {
        var model = {
            departmentKey: department.departmentKey,
            name: department.Name
        };

        return model;
    }

    function get(request, response) {
        var params = request.params,
            id = params.id,
            translated;

        dataProvider.departments.getInterface(request.user.id).get(id).then(function (department) {
            translated = translate(department);
            response.send(translated);
        }, function (error) {
            errorHandler.handle(request, response, error);
        });
    }

    function list(request, response) {
        dataProvider.departments.getInterface(request.user.id).list().then(function (departments) {
            var cc = departments.length,
                translated = [];

            while (cc-- > 0) {
                translated.push(translate(departments[cc]));
            }
            response.send(translated);
        }, function (error) {
            errorHandler.handle(request, response, error);
        });
    }

    return {
        get: get,
        list: list
    };
};
