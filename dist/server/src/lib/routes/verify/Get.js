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
const Exceptions = require("../../Exceptions");
const ErrorReplies = require("../../ErrorReplies");
const GetSessionCookie_1 = require("./GetSessionCookie");
const GetBasicAuth_1 = require("./GetBasicAuth");
const Constants = require("../../constants");
const AuthenticationSessionHandler_1 = require("../../AuthenticationSessionHandler");
const HasHeader_1 = require("../..//utils/HasHeader");
const RequestUrlGetter_1 = require("../../utils/RequestUrlGetter");
function verifyWithSelectedMethod(req, res, vars, authSession) {
    return __awaiter(this, void 0, void 0, function* () {
        if (HasHeader_1.default(req, Constants.HEADER_PROXY_AUTHORIZATION)) {
            yield GetBasicAuth_1.default(req, res, vars);
        }
        else {
            yield GetSessionCookie_1.default(req, res, vars, authSession);
        }
    });
}
function getRedirectParam(req) {
    return req.query[Constants.REDIRECT_QUERY_PARAM] != "undefined"
        ? req.query[Constants.REDIRECT_QUERY_PARAM]
        : undefined;
}
function unsafeGet(vars, req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const authSession = AuthenticationSessionHandler_1.AuthenticationSessionHandler.get(req, vars.logger);
        try {
            yield verifyWithSelectedMethod(req, res, vars, authSession);
            res.status(204);
            res.send();
        }
        catch (err) {
            let redirectUrl = getRedirectParam(req);
            const originalUrl = RequestUrlGetter_1.default.getOriginalUrl(req);
            if (redirectUrl && originalUrl) {
                redirectUrl = redirectUrl + `?${Constants.REDIRECT_QUERY_PARAM}=` + originalUrl;
                ErrorReplies.redirectTo(redirectUrl, req, res, vars.logger)(err);
                return;
            }
            throw err;
        }
    });
}
function default_1(vars) {
    return function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield unsafeGet(vars, req, res);
            }
            catch (err) {
                if (err instanceof Exceptions.NotAuthorizedError) {
                    ErrorReplies.replyWithError403(req, res, vars.logger)(err);
                }
                else {
                    ErrorReplies.replyWithError401(req, res, vars.logger)(err);
                }
            }
        });
    };
}
exports.default = default_1;
//# sourceMappingURL=Get.js.map