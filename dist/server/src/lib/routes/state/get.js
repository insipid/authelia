"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const AuthenticationSessionHandler_1 = require("../../AuthenticationSessionHandler");
function default_1(vars) {
    return function (req, res) {
        return new Bluebird(function (resolve, reject) {
            const authSession = AuthenticationSessionHandler_1.AuthenticationSessionHandler.get(req, vars.logger);
            res.json({
                username: authSession.userid,
                authentication_level: authSession.authentication_level,
                default_redirection_url: vars.config.default_redirection_url,
            });
            resolve();
        });
    };
}
exports.default = default_1;
//# sourceMappingURL=get.js.map