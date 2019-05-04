"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function replyWithError(req, res, code, logger, body) {
    return function (err) {
        logger.error(req, "Reply with error %d: %s", code, err.message);
        logger.debug(req, "%s", err.stack);
        res.status(code);
        res.send(body);
    };
}
function redirectTo(redirectUrl, req, res, logger) {
    return function (err) {
        logger.error(req, "Error: %s", err.message);
        logger.debug(req, "Redirecting to %s", redirectUrl);
        res.redirect(redirectUrl);
    };
}
exports.redirectTo = redirectTo;
function replyWithError400(req, res, logger) {
    return replyWithError(req, res, 400, logger);
}
exports.replyWithError400 = replyWithError400;
function replyWithError401(req, res, logger) {
    return replyWithError(req, res, 401, logger);
}
exports.replyWithError401 = replyWithError401;
function replyWithError403(req, res, logger) {
    return replyWithError(req, res, 403, logger);
}
exports.replyWithError403 = replyWithError403;
function replyWithError200(req, res, logger, message) {
    return replyWithError(req, res, 200, logger, { error: message });
}
exports.replyWithError200 = replyWithError200;
//# sourceMappingURL=ErrorReplies.js.map