"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BluebirdPromise = require("bluebird");
const objectPath = require("object-path");
const exceptions = require("../../../Exceptions");
const Constants = require("../constants");
class PasswordResetHandler {
    constructor(logger, usersDatabase) {
        this.logger = logger;
        this.usersDatabase = usersDatabase;
    }
    challenge() {
        return Constants.CHALLENGE;
    }
    preValidationInit(req) {
        const that = this;
        const userid = objectPath.get(req, "body.username");
        return BluebirdPromise.resolve()
            .then(function () {
            that.logger.debug(req, "User '%s' requested a password reset", userid);
            if (!userid) {
                return BluebirdPromise.reject(new exceptions.AccessDeniedError("No user id provided"));
            }
            return that.usersDatabase.getEmails(userid);
        })
            .then(function (emails) {
            if (!emails && emails.length <= 0)
                throw new Error("No email found");
            const identity = {
                email: emails[0],
                userid: userid
            };
            return BluebirdPromise.resolve(identity);
        })
            .catch(function (err) {
            return BluebirdPromise.reject(new exceptions.IdentityError(err.message));
        });
    }
    preValidationResponse(req, res) {
        res.status(204);
        res.send();
    }
    postValidationInit(req) {
        return BluebirdPromise.resolve();
    }
    postValidationResponse(req, res) {
        res.status(204);
        res.send();
    }
    mailSubject() {
        return "Reset your password";
    }
    destinationPath() {
        return "/reset-password";
    }
}
exports.default = PasswordResetHandler;
//# sourceMappingURL=PasswordResetHandler.js.map