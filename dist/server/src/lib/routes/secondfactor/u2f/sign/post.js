"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objectPath = require("object-path");
const BluebirdPromise = require("bluebird");
const redirect_1 = require("../../redirect");
const ErrorReplies = require("../../../../ErrorReplies");
const AuthenticationSessionHandler_1 = require("../../../../AuthenticationSessionHandler");
const UserMessages = require("../../../../UserMessages");
const Level_1 = require("../../../../authentication/Level");
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
            if (!authSession.sign_request) {
                const err = new Error("No sign request");
                ErrorReplies.replyWithError401(req, res, vars.logger)(err);
                return reject(err);
            }
            resolve();
        })
            .then(function () {
            const userid = authSession.userid;
            return vars.userDataStore.retrieveU2FRegistration(userid, appid);
        })
            .then(function (doc) {
            const signRequest = authSession.sign_request;
            const signData = req.body;
            vars.logger.info(req, "Finish authentication");
            return BluebirdPromise.resolve(vars.u2f.checkSignature(signRequest, signData, doc.registration.publicKey));
        })
            .then(function (result) {
            if (objectPath.has(result, "errorCode"))
                return BluebirdPromise.reject(new Error("Error while signing"));
            vars.logger.info(req, "Successful authentication");
            authSession.authentication_level = Level_1.Level.TWO_FACTOR;
            redirect_1.default(vars)(req, res);
            return BluebirdPromise.resolve();
        })
            .catch(ErrorReplies.replyWithError200(req, res, vars.logger, UserMessages.OPERATION_FAILED));
    }
    return handler;
}
exports.default = default_1;
//# sourceMappingURL=post.js.map