"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthenticationSessionHandler_1 = require("../../AuthenticationSessionHandler");
const Level_1 = require("../../authentication/Level");
function default_1(req, authSession, configuration, logger) {
    if (authSession.authentication_level == Level_1.Level.NOT_AUTHENTICATED) {
        return;
    }
    if (!configuration.session.inactivity || authSession.keep_me_logged_in) {
        return;
    }
    const lastActivityTime = authSession.last_activity_datetime;
    const currentTime = new Date().getTime();
    authSession.last_activity_datetime = currentTime;
    const inactivityPeriodMs = currentTime - lastActivityTime;
    logger.debug(req, "Inactivity period was %s sec and max period was %s sec.", inactivityPeriodMs / 1000, configuration.session.inactivity / 1000);
    if (inactivityPeriodMs < configuration.session.inactivity) {
        return;
    }
    logger.debug(req, "Session has been reset after too long inactivity period.");
    AuthenticationSessionHandler_1.AuthenticationSessionHandler.reset(req);
    throw new Error("Inactivity period exceeded.");
}
exports.default = default_1;
//# sourceMappingURL=CheckInactivity.js.map