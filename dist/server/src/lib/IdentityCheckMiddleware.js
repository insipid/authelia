"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objectPath = require("object-path");
const randomstring = require("randomstring");
const BluebirdPromise = require("bluebird");
const util = require("util");
const Exceptions = require("./Exceptions");
const ErrorReplies = require("./ErrorReplies");
const AuthenticationSessionHandler_1 = require("./AuthenticationSessionHandler");
const Constants = require("./constants");
const UserMessages_1 = require("./UserMessages");
const GetHeader_1 = require("./utils/GetHeader");
function createAndSaveToken(userid, challenge, userDataStore) {
    const five_minutes = 4 * 60 * 1000;
    const token = randomstring.generate({ length: 64 });
    return userDataStore.produceIdentityValidationToken(userid, token, challenge, five_minutes)
        .then(function () {
        return BluebirdPromise.resolve(token);
    });
}
function consumeToken(token, challenge, userDataStore) {
    return userDataStore.consumeIdentityValidationToken(token, challenge);
}
function register(app, pre_validation_endpoint, post_validation_endpoint, handler, vars) {
    app.post(pre_validation_endpoint, post_start_validation(handler, vars));
    app.post(post_validation_endpoint, post_finish_validation(handler, vars));
}
exports.register = register;
function checkIdentityToken(req, identityToken) {
    if (!identityToken)
        return BluebirdPromise.reject(new Exceptions.AccessDeniedError("No identity token provided"));
    return BluebirdPromise.resolve();
}
function post_finish_validation(handler, vars) {
    return function (req, res) {
        let authSession;
        const identityToken = objectPath.get(req, "query.token");
        vars.logger.debug(req, "Identity token provided is %s", identityToken);
        return checkIdentityToken(req, identityToken)
            .then(() => {
            authSession = AuthenticationSessionHandler_1.AuthenticationSessionHandler.get(req, vars.logger);
            return handler.postValidationInit(req);
        })
            .then(() => {
            return consumeToken(identityToken, handler.challenge(), vars.userDataStore);
        })
            .then((doc) => {
            authSession.identity_check = {
                challenge: handler.challenge(),
                userid: doc.userId
            };
            handler.postValidationResponse(req, res);
            return BluebirdPromise.resolve();
        })
            .catch(ErrorReplies.replyWithError200(req, res, vars.logger, UserMessages_1.OPERATION_FAILED));
    };
}
exports.post_finish_validation = post_finish_validation;
function post_start_validation(handler, vars) {
    return function (req, res) {
        let identity;
        return handler.preValidationInit(req)
            .then((id) => {
            identity = id;
            const email = identity.email;
            const userid = identity.userid;
            vars.logger.info(req, "Start identity validation of user \"%s\"", userid);
            if (!(email && userid))
                return BluebirdPromise.reject(new Exceptions.IdentityError("Missing user id or email address"));
            return createAndSaveToken(userid, handler.challenge(), vars.userDataStore);
        })
            .then((token) => {
            const scheme = GetHeader_1.default(req, Constants.HEADER_X_FORWARDED_PROTO);
            const host = GetHeader_1.default(req, Constants.HEADER_X_FORWARDED_HOST);
            const link_url = util.format("%s://%s/#%s?token=%s", scheme, host, handler.destinationPath(), token);
            vars.logger.info(req, "Notification sent to user \"%s\"", identity.userid);
            return vars.notifier.notify(identity.email, handler.mailSubject(), link_url);
        })
            .then(() => {
            handler.preValidationResponse(req, res);
            return BluebirdPromise.resolve();
        })
            .catch(Exceptions.IdentityError, (err) => {
            vars.logger.error(req, err.message);
            handler.preValidationResponse(req, res);
            return BluebirdPromise.resolve();
        })
            .catch(ErrorReplies.replyWithError401(req, res, vars.logger));
    };
}
exports.post_start_validation = post_start_validation;
//# sourceMappingURL=IdentityCheckMiddleware.js.map