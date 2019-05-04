"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BluebirdPromise = require("bluebird");
const objectPath = require("object-path");
const AuthenticationSessionHandler_1 = require("../../../AuthenticationSessionHandler");
const ErrorReplies = require("../../../ErrorReplies");
const UserMessages = require("../../../UserMessages");
const Constants = require("./../constants");
function default_1(vars) {
    return function (req, res) {
        let authSession;
        const newPassword = objectPath.get(req, "body.password");
        return new BluebirdPromise(function (resolve, reject) {
            authSession = AuthenticationSessionHandler_1.AuthenticationSessionHandler.get(req, vars.logger);
            if (!authSession.identity_check) {
                reject(new Error("No identity check initiated"));
                return;
            }
            vars.logger.info(req, "User %s wants to reset his/her password.", authSession.identity_check.userid);
            vars.logger.debug(req, "Challenge %s", authSession.identity_check.challenge);
            if (authSession.identity_check.challenge != Constants.CHALLENGE) {
                reject(new Error("Bad challenge."));
                return;
            }
            resolve();
        })
            .then(function () {
            return vars.usersDatabase.updatePassword(authSession.identity_check.userid, newPassword);
        })
            .then(function () {
            vars.logger.info(req, "Password reset for user '%s'", authSession.identity_check.userid);
            AuthenticationSessionHandler_1.AuthenticationSessionHandler.reset(req);
            res.status(204);
            res.send();
            return BluebirdPromise.resolve();
        })
            .catch(ErrorReplies.replyWithError200(req, res, vars.logger, UserMessages.RESET_PASSWORD_FAILED));
    };
}
exports.default = default_1;
//# sourceMappingURL=post.js.map