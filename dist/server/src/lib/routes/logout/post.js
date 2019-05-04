"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthenticationSessionHandler_1 = require("../../AuthenticationSessionHandler");
const Constants = require("../../constants");
function getRedirectParam(req) {
    return req.query[Constants.REDIRECT_QUERY_PARAM] != "undefined"
        ? req.query[Constants.REDIRECT_QUERY_PARAM]
        : undefined;
}
function default_1(vars) {
    return function (req, res) {
        const redirect_param = getRedirectParam(req);
        const redirect_url = redirect_param || "/";
        AuthenticationSessionHandler_1.AuthenticationSessionHandler.reset(req);
        res.redirect(redirect_url);
    };
}
exports.default = default_1;
//# sourceMappingURL=post.js.map