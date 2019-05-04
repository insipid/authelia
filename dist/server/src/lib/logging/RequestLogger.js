"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Util = require("util");
class RequestLogger {
    constructor(winston) {
        this.winston = winston;
    }
    formatHeader(req) {
        const clientIP = req.ip;
        return Util.format("date='%s' method='%s', path='%s' requestId='%s' sessionId='%s' ip='%s'", new Date(), req.method, req.path, req.id, req.sessionID, clientIP);
    }
    formatBody(message) {
        return Util.format("message='%s'", message);
    }
    formatMessage(req, message) {
        return Util.format("%s %s", this.formatHeader(req), this.formatBody(message));
    }
    info(req, message, ...args) {
        this.winston.info(this.formatMessage(req, message), ...args);
    }
    debug(req, message, ...args) {
        this.winston.debug(this.formatMessage(req, message), ...args);
    }
    error(req, message, ...args) {
        this.winston.error(this.formatMessage(req, message), ...args);
    }
}
exports.RequestLogger = RequestLogger;
//# sourceMappingURL=RequestLogger.js.map