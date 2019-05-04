"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants = require("../constants");
const GetHeader_1 = require("./GetHeader");
const HasHeader_1 = require("./HasHeader");
class RequestUrlGetter {
    static getOriginalUrl(req) {
        if (HasHeader_1.default(req, Constants.HEADER_X_ORIGINAL_URL)) {
            return GetHeader_1.default(req, Constants.HEADER_X_ORIGINAL_URL);
        }
        const proto = GetHeader_1.default(req, Constants.HEADER_X_FORWARDED_PROTO);
        const host = GetHeader_1.default(req, Constants.HEADER_X_FORWARDED_HOST);
        const uri = GetHeader_1.default(req, Constants.HEADER_X_FORWARDED_URI);
        if (!proto || !host) {
            throw new Error("Missing headers holding requested URL. Requires either X-Original-Url or X-Forwarded-Proto, X-Forwarded-Host and X-Forwarded-Uri.");
        }
        if (!uri) {
            return `${proto}://${host}`;
        }
        return `${proto}://${host}${uri}`;
    }
}
exports.default = RequestUrlGetter;
//# sourceMappingURL=RequestUrlGetter.js.map