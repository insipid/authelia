"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Util = require("util");
class GlobalLogger {
    constructor(winston) {
        this.winston = winston;
    }
    buildMessage(message, ...args) {
        return Util.format("date='%s' message='%s'", new Date(), Util.format(message, ...args));
    }
    info(message, ...args) {
        this.winston.info(this.buildMessage(message, ...args));
    }
    debug(message, ...args) {
        this.winston.debug(this.buildMessage(message, ...args));
    }
    error(message, ...args) {
        this.winston.debug(this.buildMessage(message, ...args));
    }
}
exports.GlobalLogger = GlobalLogger;
//# sourceMappingURL=GlobalLogger.js.map