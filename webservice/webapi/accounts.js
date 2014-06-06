module.exports = function (organizationId, dataProvider) {
    var api = require("../../api/accounts.js")(dataProvider);

    function translateAccount(account, auditUserId) {
        var model = {
            accountKey: account.accountKey,
            since: account.since
        };

        if (auditUserId == account.authUserId) {
            // protected fields.
            // SECURITY MODEL will also include these fields when audit user has proper permissions.
            model.authUserId = account.authUserId; 
            model.fullName = account.fullName;
            model.authenticator = account.authenticator;
        }

        return model;
    }
    
    function get (request, response) {
        var params = request.params,
            id = params.id,
            auditUser = request.user,
            auditUserId = auditUser.id,
            iface = api.getInterface(organizationId, auditUserId),
            account = iface.get(id);

        if (!account) {
            account = iface.create("Google", auditUserId, auditUser.name);
        }

        console.log({"id":id, "account":account});
        response.send(translateAccount(account));
    }

    return {
        get: get
    };
};
