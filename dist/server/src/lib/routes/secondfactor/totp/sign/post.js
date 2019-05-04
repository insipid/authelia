"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const redirect_1 = require("../../redirect");
const ErrorReplies = require("../../../../ErrorReplies");
const AuthenticationSessionHandler_1 = require("../../../../AuthenticationSessionHandler");
const UserMessages = require("../../../../UserMessages");
const Level_1 = require("../../../../authentication/Level");
function default_1(vars) {
    function handler(req, res) {
        let authSession;
        const token = req.body.token;
        return new Bluebird(function (resolve, reject) {
            authSession = AuthenticationSessionHandler_1.AuthenticationSessionHandler.get(req, vars.logger);
            vars.logger.info(req, "Initiate TOTP validation for user \"%s\".", authSession.userid);
            resolve();
        })
            .then(function () {
            return vars.userDataStore.retrieveTOTPSecret(authSession.userid);
        })
            .then(function (doc) {
            if (!vars.totpHandler.validate(token, doc.secret.base32)) {
                return Bluebird.reject(new Error("Invalid TOTP token."));
            }
            vars.logger.debug(req, "TOTP validation succeeded.");
            authSession.authentication_level = Level_1.Level.TWO_FACTOR;
            redirect_1.default(vars)(req, res);
            return Bluebird.resolve();
        })
            .catch(ErrorReplies.replyWithError200(req, res, vars.logger, UserMessages.AUTHENTICATION_TOTP_FAILED));
    }
    return handler;
}
exports.default = default_1;
//# sourceMappingURL=post.js.map