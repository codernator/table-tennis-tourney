module.exports = (function () {
    "use strict";
    function handle(request, response, error) {
        console.log("Error Handler: ", error);
        response.send(error);
    }

    return {
        get: function (request, response) {
            return function(error) { handle(request, response, error); };
        },
        handle: handle
    };
}());
