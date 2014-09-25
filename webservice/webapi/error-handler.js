module.exports = (function () {
    "use strict";
    function handle(request, response, error) {
        response.send(error);
    }

    return {
        handle: handle
    };
}());
