"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BluebirdPromise = require("bluebird");
const ErrorReplies = require("../../ErrorReplies");
const AuthenticationSessionHandler_1 = require("../../AuthenticationSessionHandler");
const Exceptions = require("../../Exceptions");
const Level_1 = require("../../authentication/Level");
class RequireValidatedFirstFactor {
    static middleware(logger) {
        return function (req, res, next) {
            return new BluebirdPromise(function (resolve, reject) {
                const authSession = AuthenticationSessionHandler_1.AuthenticationSessionHandler.get(req, logger);
                if (!authSession.userid || authSession.authentication_level < Level_1.Level.ONE_FACTOR)
                    return reject(new Exceptions.FirstFactorValidationError("First factor has not been validated yet."));
                next();
                resolve();
            })
                .catch(ErrorReplies.replyWithError401(req, res, logger));
        };
    }
}
exports.RequireValidatedFirstFactor = RequireValidatedFirstFactor;
//# sourceMappingURL=RequireValidatedFirstFactor.js.map