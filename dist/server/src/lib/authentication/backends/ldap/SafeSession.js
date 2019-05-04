"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BluebirdPromise = require("bluebird");
const Sanitizer_1 = require("./Sanitizer");
const SPECIAL_CHAR_USED_MESSAGE = "Special character used in LDAP query.";
class SafeSession {
    constructor(sesion, logger) {
        this.sesion = sesion;
        this.logger = logger;
    }
    open() {
        return this.sesion.open();
    }
    close() {
        return this.sesion.close();
    }
    searchGroups(username) {
        try {
            const sanitizedUsername = Sanitizer_1.Sanitizer.sanitize(username);
            return this.sesion.searchGroups(sanitizedUsername);
        }
        catch (e) {
            this.logger.error("Error with input " + username + ". Cause:" + e);
            return BluebirdPromise.reject(new Error(SPECIAL_CHAR_USED_MESSAGE));
        }
    }
    searchUserDn(username) {
        try {
            const sanitizedUsername = Sanitizer_1.Sanitizer.sanitize(username);
            return this.sesion.searchUserDn(sanitizedUsername);
        }
        catch (e) {
            this.logger.error("Error with input " + username + ". Cause:" + e);
            return BluebirdPromise.reject(new Error(SPECIAL_CHAR_USED_MESSAGE));
        }
    }
    searchEmails(username) {
        try {
            const sanitizedUsername = Sanitizer_1.Sanitizer.sanitize(username);
            return this.sesion.searchEmails(sanitizedUsername);
        }
        catch (e) {
            this.logger.error("Error with input " + username + ". Cause:" + e);
            return BluebirdPromise.reject(new Error(SPECIAL_CHAR_USED_MESSAGE));
        }
    }
    modifyPassword(username, newPassword) {
        try {
            const sanitizedUsername = Sanitizer_1.Sanitizer.sanitize(username);
            return this.sesion.modifyPassword(sanitizedUsername, newPassword);
        }
        catch (e) {
            this.logger.error("Error with input " + username + ". Cause:" + e);
            return BluebirdPromise.reject(new Error(SPECIAL_CHAR_USED_MESSAGE));
        }
    }
}
exports.SafeSession = SafeSession;
//# sourceMappingURL=SafeSession.js.map