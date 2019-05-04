"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BluebirdPromise = require("bluebird");
const FirstFactorValidator = require("../../../../FirstFactorValidator");
const AuthenticationSessionHandler_1 = require("../../../../AuthenticationSessionHandler");
const CHALLENGE = "u2f-register";
const MAIL_SUBJECT = "Register your security key with Authelia";
class RegistrationHandler {
    constructor(logger) {
        this.logger = logger;
    }
    challenge() {
        return CHALLENGE;
    }
    retrieveIdentity(req) {
        const that = this;
        return new BluebirdPromise(function (resolve, reject) {
            const authSession = AuthenticationSessionHandler_1.AuthenticationSessionHandler.get(req, that.logger);
            const userid = authSession.userid;
            const email = authSession.email;
            if (!(userid && email)) {
                return reject(new Error("User ID or email is missing"));
            }
            const identity = {
                email: email,
                userid: userid
            };
            return resolve(identity);
        });
    }
    preValidationInit(req) {
        const that = this;
        return FirstFactorValidator.validate(req, this.logger)
            .then(function () {
            return that.retrieveIdentity(req);
        });
    }
    preValidationResponse(req, res) {
        res.json({ message: "OK" });
    }
    postValidationInit(req) {
        return FirstFactorValidator.validate(req, this.logger);
    }
    postValidationResponse(req, res) {
        res.json({ message: "OK" });
    }
    mailSubject() {
        return MAIL_SUBJECT;
    }
    destinationPath() {
        return "/security-key-registration";
    }
}
exports.default = RegistrationHandler;
//# sourceMappingURL=RegistrationHandler.js.map