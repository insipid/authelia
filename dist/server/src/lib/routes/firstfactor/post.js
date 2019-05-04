"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BluebirdPromise = require("bluebird");
const ErrorReplies = require("../../ErrorReplies");
const AuthenticationSessionHandler_1 = require("../../AuthenticationSessionHandler");
const UserMessages = require("../../UserMessages");
const Level_1 = require("../../authentication/Level");
const Level_2 = require("../../authorization/Level");
const BelongToDomain_1 = require("../../BelongToDomain");
const URLDecomposer_1 = require("../..//utils/URLDecomposer");
const AuthenticationError_1 = require("../../../lib/authentication/AuthenticationError");
const IsRedirectionSafe_1 = require("../../../lib/utils/IsRedirectionSafe");
const URLParse = require("url-parse");
const GetHeader_1 = require("../../utils/GetHeader");
function default_1(vars) {
    return function (req, res) {
        const username = req.body.username;
        const password = req.body.password;
        const keepMeLoggedIn = req.body.keepMeLoggedIn;
        let authSession;
        if (keepMeLoggedIn) {
            vars.logger.debug(req, "User requested to stay logged in for one year.");
            req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
        }
        return BluebirdPromise.resolve()
            .then(function () {
            if (!username || !password) {
                return BluebirdPromise.reject(new Error("No username or password."));
            }
            vars.logger.info(req, "Starting authentication of user \"%s\"", username);
            authSession = AuthenticationSessionHandler_1.AuthenticationSessionHandler.get(req, vars.logger);
            return vars.regulator.regulate(username);
        })
            .then(function () {
            vars.logger.info(req, "No regulation applied.");
            return vars.usersDatabase.checkUserPassword(username, password);
        })
            .then(function (groupsAndEmails) {
            vars.logger.info(req, "LDAP binding successful. Retrieved information about user are %s", JSON.stringify(groupsAndEmails));
            authSession.userid = username;
            authSession.keep_me_logged_in = keepMeLoggedIn;
            authSession.authentication_level = Level_1.Level.ONE_FACTOR;
            const emails = groupsAndEmails.emails;
            const groups = groupsAndEmails.groups;
            if (emails.length > 0)
                authSession.email = emails[0];
            authSession.groups = groups;
            vars.logger.debug(req, "Mark successful authentication to regulator.");
            vars.regulator.mark(username, true);
        })
            .then(function () {
            const targetUrl = GetHeader_1.default(req, "x-target-url");
            if (!targetUrl) {
                res.status(204);
                res.send();
                return BluebirdPromise.resolve();
            }
            if (BelongToDomain_1.BelongToDomain(targetUrl, vars.config.session.domain)) {
                const resource = URLDecomposer_1.URLDecomposer.fromUrl(targetUrl);
                const resObject = {
                    domain: resource.domain,
                    resource: resource.path,
                };
                const subject = {
                    user: authSession.userid,
                    groups: authSession.groups
                };
                const authorizationLevel = vars.authorizer.authorization(resObject, subject, req.ip);
                if (authorizationLevel <= Level_2.Level.ONE_FACTOR) {
                    if (IsRedirectionSafe_1.default(vars, new URLParse(targetUrl))) {
                        res.json({ redirect: targetUrl });
                        return BluebirdPromise.resolve();
                    }
                    else {
                        res.json({ error: "You're authenticated but cannot be automatically redirected to an unsafe URL." });
                        return BluebirdPromise.resolve();
                    }
                }
            }
            res.status(204);
            res.send();
            return BluebirdPromise.resolve();
        })
            .catch(AuthenticationError_1.default, function (err) {
            vars.regulator.mark(username, false);
            return ErrorReplies.replyWithError200(req, res, vars.logger, UserMessages.AUTHENTICATION_FAILED)(err);
        })
            .catch(ErrorReplies.replyWithError200(req, res, vars.logger, UserMessages.AUTHENTICATION_FAILED));
    };
}
exports.default = default_1;
//# sourceMappingURL=post.js.map