"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const SetUserAndGroupsHeaders_1 = require("./SetUserAndGroupsHeaders");
const CheckAuthorizations_1 = require("./CheckAuthorizations");
const CheckInactivity_1 = require("./CheckInactivity");
const RequestUrlGetter_1 = require("../../utils/RequestUrlGetter");
const URLParse = require("url-parse");
function default_1(req, res, vars, authSession) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!authSession) {
            throw new Error("No cookie detected.");
        }
        const originalUrl = RequestUrlGetter_1.default.getOriginalUrl(req);
        if (!originalUrl) {
            throw new Error("Cannot detect the original URL from headers.");
        }
        const url = new URLParse(originalUrl);
        const username = authSession.userid;
        const groups = authSession.groups;
        vars.logger.debug(req, "domain=%s, path=%s, user=%s, groups=%s, ip=%s", url.hostname, url.pathname, (username) ? username : "unknown", (groups instanceof Array && groups.length > 0) ? groups.join(",") : "unknown", req.ip);
        CheckAuthorizations_1.default(vars.authorizer, url.hostname, url.pathname, username, groups, req.ip, authSession.authentication_level);
        CheckInactivity_1.default(req, authSession, vars.config, vars.logger);
        SetUserAndGroupsHeaders_1.default(res, username, groups);
    });
}
exports.default = default_1;
//# sourceMappingURL=GetSessionCookie.js.map