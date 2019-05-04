"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Util = require("util");
const Exceptions = require("../../Exceptions");
const Level_1 = require("../../authorization/Level");
const Level_2 = require("../../authentication/Level");
function isAuthorized(authorization, authentication) {
    if (authorization == Level_1.Level.BYPASS) {
        return true;
    }
    else if (authorization == Level_1.Level.ONE_FACTOR &&
        authentication >= Level_2.Level.ONE_FACTOR) {
        return true;
    }
    else if (authorization == Level_1.Level.TWO_FACTOR &&
        authentication >= Level_2.Level.TWO_FACTOR) {
        return true;
    }
    return false;
}
function default_1(authorizer, domain, resource, user, groups, ip, authenticationLevel) {
    const authorizationLevel = authorizer
        .authorization({ domain, resource }, { user, groups }, ip);
    if (authorizationLevel == Level_1.Level.BYPASS) {
        return;
    }
    else if (user && authorizationLevel == Level_1.Level.DENY) {
        throw new Exceptions.NotAuthorizedError(Util.format("User %s is not authorized to access %s%s", (user) ? user : "unknown", domain, resource));
    }
    else if (!isAuthorized(authorizationLevel, authenticationLevel)) {
        throw new Exceptions.NotAuthenticatedError(Util.format("User '%s' is not sufficiently authorized to access %s%s.", (user) ? user : "unknown", domain, resource));
    }
}
exports.default = default_1;
//# sourceMappingURL=CheckAuthorizations.js.map