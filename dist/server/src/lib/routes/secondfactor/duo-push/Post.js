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
const AuthenticationSessionHandler_1 = require("../../../AuthenticationSessionHandler");
const ErrorReplies = require("../../../ErrorReplies");
const UserMessage = require("../../../UserMessages");
const redirect_1 = require("../redirect");
const Level_1 = require("../../../authentication/Level");
const GetHeader_1 = require("../../../utils/GetHeader");
const constants_1 = require("../../../constants");
const DuoApi = require("@duosecurity/duo_api");
function triggerAuth(username, config, req) {
    return new Promise((resolve, reject) => {
        const clientIP = req.ip;
        const targetURL = GetHeader_1.default(req, constants_1.HEADER_X_TARGET_URL);
        const client = new DuoApi.Client(config.integration_key, config.secret_key, config.hostname);
        const timer = setTimeout(() => reject(new Error("Call to duo push API timed out.")), 60000);
        client.jsonApiCall("POST", "/auth/v2/auth", { username, ipaddr: clientIP, factor: "push", device: "auto", pushinfo: `target%20url=${targetURL}` }, (data) => {
            clearTimeout(timer);
            resolve(data);
        });
    });
}
function default_1(vars) {
    return function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!vars.config.duo_api) {
                    throw new Error("Duo Push Notification is not configured.");
                }
                const authSession = AuthenticationSessionHandler_1.AuthenticationSessionHandler.get(req, vars.logger);
                const authRes = yield triggerAuth(authSession.userid, vars.config.duo_api, req);
                if (authRes.response.result !== "allow") {
                    throw new Error("User denied access.");
                }
                vars.logger.debug(req, "Access allowed by user via Duo Push.");
                authSession.authentication_level = Level_1.Level.TWO_FACTOR;
                yield redirect_1.default(vars)(req, res);
            }
            catch (err) {
                ErrorReplies.replyWithError200(req, res, vars.logger, UserMessage.OPERATION_FAILED)(err);
            }
        });
    };
}
exports.default = default_1;
//# sourceMappingURL=Post.js.map