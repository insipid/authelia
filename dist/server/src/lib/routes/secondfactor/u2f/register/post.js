"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objectPath = require("object-path");
const BluebirdPromise = require("bluebird");
const redirect_1 = require("../../redirect");
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
        const registrationResponse = req.body;
        return new BluebirdPromise(function (resolve, reject) {
            authSession = AuthenticationSessionHandler_1.AuthenticationSessionHandler.get(req, vars.logger);
            const registrationRequest = authSession.register_request;
            if (!registrationRequest) {
                return reject(new Error("No registration request"));
            }
            if (!authSession.identity_check
                || authSession.identity_check.challenge != "u2f-register") {
                return reject(new Error("Bad challenge for registration request"));
            }
            vars.logger.info(req, "Finishing registration");
            vars.logger.debug(req, "RegistrationRequest = %s", JSON.stringify(registrationRequest));
            vars.logger.debug(req, "RegistrationResponse = %s", JSON.stringify(registrationResponse));
            return resolve(vars.u2f.checkRegistration(registrationRequest, registrationResponse));
        })
            .then(function (u2fResult) {
            if (objectPath.has(u2fResult, "errorCode"))
                return BluebirdPromise.reject(new Error("Error while registering."));
            const registrationResult = u2fResult;
            vars.logger.info(req, "Store registration and reply");
            vars.logger.debug(req, "RegistrationResult = %s", JSON.stringify(registrationResult));
            const registration = {
                keyHandle: registrationResult.keyHandle,
                publicKey: registrationResult.publicKey
            };
            return vars.userDataStore.saveU2FRegistration(authSession.userid, appid, registration);
        })
            .then(function () {
            authSession.identity_check = undefined;
            redirect_1.default(vars)(req, res);
            return BluebirdPromise.resolve();
        })
            .catch(ErrorReplies.replyWithError200(req, res, vars.logger, UserMessages.OPERATION_FAILED));
    }
    return handler;
}
exports.default = default_1;
//# sourceMappingURL=post.js.map