"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Level_1 = require("./authentication/Level");
const INITIAL_AUTHENTICATION_SESSION = {
    keep_me_logged_in: false,
    authentication_level: Level_1.Level.NOT_AUTHENTICATED,
    last_activity_datetime: undefined,
    userid: undefined,
    email: undefined,
    groups: [],
    register_request: undefined,
    sign_request: undefined,
    identity_check: undefined,
    redirect: undefined
};
class AuthenticationSessionHandler {
    static reset(req) {
        req.session.auth = Object.assign({}, INITIAL_AUTHENTICATION_SESSION, {});
        req.session.auth.last_activity_datetime = new Date().getTime();
    }
    static get(req, logger) {
        if (!req.session) {
            const errorMsg = "Something is wrong with session cookies. Please check Redis is running and Authelia can connect to it.";
            logger.error(req, errorMsg);
            throw new Error(errorMsg);
        }
        if (!req.session.auth) {
            logger.debug(req, "Authentication session %s was undefined. Resetting..." +
                " If it's unexpected, make sure you are visiting the expected domain.", req.sessionID);
            AuthenticationSessionHandler.reset(req);
        }
        return req.session.auth;
    }
}
exports.AuthenticationSessionHandler = AuthenticationSessionHandler;
//# sourceMappingURL=AuthenticationSessionHandler.js.map