/*jshint browser: false, devel: false, debug: true, evil: true, forin: true, es5: false, undef: true, node: true, bitwise: false, eqnull: true, noarg: true, noempty: true, eqeqeq: true, boss: true, loopfunc: true, laxbreak: true, strict: true, curly: true, nonew: true, jquery: false */

function renderSimpleView(api, request, response) {
    "use strict";
    var path = request.path, // eg: /account
        viewName = path.substring(1); // eg: account;

    response.render(viewName, { user: request.user, api: api });
}

function renderRootView(dal, api, request, response) {
    "use strict";
    var account = dal.accounts.getInterface(dal.organizationId, request.user.id).get(request.user.id),
        profile = dal.profiles.getInterface(dal.organizationId, request.user.id).get(account.profileKey),
        view;

    if (profile.profileKey === 0) {
        view = "profile";
    } else {
        view = "index";
    }

    response.render(view, { user: request.user, api: api });
}

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(request, response, next) {
    "use strict";
    if (request.isAuthenticated()) { return next(); }
    response.redirect('/login');
}

/* global require */
function configurePassport(config) {
    "use strict";

    var passport = require('passport'),
        GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    function googleValidate(accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
            // To keep the example simple, the user's Google profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the Google account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
        });
    }

    function getGoogleStrategyOptions() {
        return {
            clientID: config.Google.ClientId,
            clientSecret: config.Google.ClientSecret,
            callbackURL: config.PassportCallbackBase + config.Google.Callback
        };
    }

    // Passport session setup.
    //   To support persistent login sessions, Passport needs to be able to
    //   serialize users into and deserialize users out of the session.  Typically,
    //   this will be as simple as storing the user ID when serializing, and finding
    //   the user by ID when deserializing.  However, since this example does not
    //   have a database of user records, the complete Google profile is
    //   serialized and deserialized.
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    // Use the GoogleStrategy within Passport.
    //   Strategies in Passport require a `verify` function, which accept
    //   credentials (in this case, an accessToken, refreshToken, and Google
    //   profile), and invoke a callback with a user object.
    passport.use(new GoogleStrategy(getGoogleStrategyOptions(), googleValidate));

    return passport;
}

(function () {
    "use strict";
    var config = require('./config.json'),
        express = require('express'),
        mongoose = require('mongoose'),
        dal = {
            organizationId: config.OrganizationId,
            accounts: require("../api/accounts.js")(mongoose),
            profiles: require("../api/profiles.js")(mongoose)
        },
        api = {
            accounts: require("./webapi/accounts.js")(config.OrganizationId, mongoose),
            departments: require("./webapi/departments.js")(config.OrganizationId, mongoose)
        },
        my = {
            renderSimpleView: function(request, response) { return renderSimpleView(api, request, response); },
            renderRootView: function(request, response) { return renderRootView(dal, api, request, response); }
        },
        app = express(),
        passport = configurePassport(config);

    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(require('cookie-parser')());
    app.use(require('body-parser')());
    app.use(require('method-override')(config.MethodOverrideKey));
    app.use(require('express-session')({ secret: config.SessionSecret }));
    app.use(passport.initialize());
    app.use(passport.session()); // Use passport.session() middleware to support persistent login sessions.
    app.use(express.static(__dirname + '/public')); // jshint ignore:line

    app.get('/', ensureAuthenticated, my.renderRootView);
    app.get('/login', my.renderSimpleView);
    app.get('/users/get/:id?', ensureAuthenticated, api.accounts.get);

    // GET /auth/google
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in Google authentication will involve
    //   redirecting the user to google.com.  After authorization, Google
    //   will redirect the user back to this application at /auth/google/callback
    app.get('/auth/google',
            passport.authenticate('google', { scope: config.Google.PassportScope }),
            function () {
                // The request will be redirected to Google for authentication, so this
                // function will not be called.
                return;
            });

    // GET /auth/google/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function function will be called,
    //   which, in this example, will redirect the user to the home page.
    app.get('/auth/google/callback',
            passport.authenticate('google', { failureRedirect: '/login' }),
            function (request, response) {
                response.redirect('/');
            });

    app.get('/logout', function (request, response) {
        request.logout();
        response.redirect('/');
    });

    app.listen(3000);
}());