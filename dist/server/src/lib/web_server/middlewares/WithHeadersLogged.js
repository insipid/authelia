"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WithHeadersLogged {
    static middleware(logger) {
        return function (req, res, next) {
            logger.debug(req, "Headers = %s", JSON.stringify(req.headers));
            next();
        };
    }
}
exports.WithHeadersLogged = WithHeadersLogged;
//# sourceMappingURL=WithHeadersLogged.js.map