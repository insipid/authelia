"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BluebirdPromise = require("bluebird");
const Exceptions = require("./Exceptions");
const AuthenticationSessionHandler_1 = require("./AuthenticationSessionHandler");
const Level_1 = require("./authentication/Level");
function validate(req, logger) {
    return new BluebirdPromise(function (resolve, reject) {
        const authSession = AuthenticationSessionHandler_1.AuthenticationSessionHandler.get(req, logger);
        if (!authSession.userid || authSession.authentication_level < Level_1.Level.ONE_FACTOR)
            return reject(new Exceptions.FirstFactorValidationError("First factor has not been validated yet."));
        resolve();
    });
}
exports.validate = validate;
//# sourceMappingURL=FirstFactorValidator.js.map