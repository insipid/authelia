"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BluebirdPromise = require("bluebird");
const exceptions = require("../../../../Exceptions");
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
            resolve();
        })
            .then(function () {
            return vars.userDataStore.retrieveU2FRegistration(authSession.userid, appid);
        })
            .then(function (doc) {
            if (!doc)
                return BluebirdPromise.reject(new exceptions.AccessDeniedError("No U2F registration document found."));
            vars.logger.info(req, "Start authentication of app '%s'", appid);
            vars.logger.debug(req, "AppId = %s, keyHandle = %s", appid, JSON.stringify(doc.registration.keyHandle));
            const request = vars.u2f.request(appid, doc.registration.keyHandle);
            authSession.sign_request = request;
            res.json(request);
            return BluebirdPromise.resolve();
        })
            .catch(ErrorReplies.replyWithError200(req, res, vars.logger, UserMessages.OPERATION_FAILED));
    }
    return handler;
}
exports.default = default_1;
//# sourceMappingURL=get.js.map