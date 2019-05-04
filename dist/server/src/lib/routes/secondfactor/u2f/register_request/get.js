"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BluebirdPromise = require("bluebird");
const ErrorReplies = require("../../../../ErrorReplies");
const AuthenticationSessionHandler_1 = require("../../../../AuthenticationSessionHandler");
const UserMessages = require("../../../../UserMessages");
const GetHeader_1 = require("../../../../utils/GetHeader");
const Constants = require("../../../../constants");
function default_1(vars) {
    function handler(req, res) {
        let authSession;
        const scheme = GetHeader_1.default(req, Constants.HEADER_X_FORWARDED_PROTO);
        const host = GetHeader_1.default(req, Constants.HEADER_X_FORWARDED_HOST);
        const appid = scheme + "://" + host;
        return new BluebirdPromise(function (resolve, reject) {
            authSession = AuthenticationSessionHandler_1.AuthenticationSessionHandler.get(req, vars.logger);
            if (!authSession.identity_check
                || authSession.identity_check.challenge != "u2f-register") {
                return reject(new Error("Bad challenge."));
            }
            vars.logger.info(req, "Starting registration for appId '%s'", appid);
            return resolve(vars.u2f.request(appid));
        })
            .then(function (registrationRequest) {
            vars.logger.debug(req, "RegistrationRequest = %s", JSON.stringify(registrationRequest));
            authSession.register_request = registrationRequest;
            res.json(registrationRequest);
            return BluebirdPromise.resolve();
        })
            .catch(ErrorReplies.replyWithError200(req, res, vars.logger, UserMessages.OPERATION_FAILED));
    }
    return handler;
}
exports.default = default_1;
//# sourceMappingURL=get.js.map