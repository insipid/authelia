"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BluebirdPromise = require("bluebird");
const Constants = require("../constants");
const ErrorReplies = require("../../../../ErrorReplies");
const AuthenticationSessionHandler_1 = require("../../../../AuthenticationSessionHandler");
const UserMessages = require("../../../../UserMessages");
const FirstFactorValidator = require("../../../../FirstFactorValidator");
class RegistrationHandler {
    constructor(logger, userDataStore, totp, configuration) {
        this.logger = logger;
        this.userDataStore = userDataStore;
        this.totp = totp;
        this.configuration = configuration;
    }
    challenge() {
        return Constants.CHALLENGE;
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
        const that = this;
        let secret;
        let userId;
        return new BluebirdPromise(function (resolve, reject) {
            const authSession = AuthenticationSessionHandler_1.AuthenticationSessionHandler.get(req, that.logger);
            userId = authSession.userid;
            if (authSession.identity_check.challenge != Constants.CHALLENGE
                || !userId)
                return reject(new Error("Bad challenge."));
            resolve();
        })
            .then(function () {
            secret = that.totp.generate(userId, that.configuration.issuer);
            that.logger.debug(req, "Save the TOTP secret in DB");
            return that.userDataStore.saveTOTPSecret(userId, secret);
        })
            .then(function () {
            AuthenticationSessionHandler_1.AuthenticationSessionHandler.reset(req);
            res.json({
                base32_secret: secret.base32,
                otpauth_url: secret.otpauth_url,
            });
        })
            .catch(ErrorReplies.replyWithError200(req, res, that.logger, UserMessages.OPERATION_FAILED));
    }
    mailSubject() {
        return "Set up Authelia's one-time password";
    }
    destinationPath() {
        return "/one-time-password-registration";
    }
}
exports.default = RegistrationHandler;
//# sourceMappingURL=RegistrationHandler.js.map