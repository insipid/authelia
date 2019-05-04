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
const URLDecomposer_1 = require("../../utils/URLDecomposer");
const Level_1 = require("../../authentication/Level");
const GetHeader_1 = require("../../utils/GetHeader");
const constants_1 = require("../../constants");
const SetUserAndGroupsHeaders_1 = require("./SetUserAndGroupsHeaders");
const CheckAuthorizations_1 = require("./CheckAuthorizations");
const RequestUrlGetter_1 = require("../../utils/RequestUrlGetter");
function default_1(req, res, vars) {
    return __awaiter(this, void 0, void 0, function* () {
        const authorizationValue = GetHeader_1.default(req, constants_1.HEADER_PROXY_AUTHORIZATION);
        if (!authorizationValue.startsWith("Basic ")) {
            throw new Error("The authorization header should be of the form 'Basic XXXXXX'");
        }
        const base64Re = new RegExp("^Basic ((?:[A-Za-z0-9+/]{4})*" +
            "(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)$");
        const isTokenValidBase64 = base64Re.test(authorizationValue);
        if (!isTokenValidBase64) {
            throw new Error("No valid base64 token found in the header");
        }
        const tokenMatches = authorizationValue.match(base64Re);
        const base64Token = tokenMatches[1];
        const decodedToken = Buffer.from(base64Token, "base64").toString();
        const splittedToken = decodedToken.split(":");
        if (splittedToken.length != 2) {
            throw new Error("The authorization token is invalid. Expecting 'userid:password'");
        }
        const username = splittedToken[0];
        const password = splittedToken[1];
        const groupsAndEmails = yield vars.usersDatabase.checkUserPassword(username, password);
        const uri = RequestUrlGetter_1.default.getOriginalUrl(req);
        const urlDecomposition = URLDecomposer_1.URLDecomposer.fromUrl(uri);
        CheckAuthorizations_1.default(vars.authorizer, urlDecomposition.domain, urlDecomposition.path, username, groupsAndEmails.groups, req.ip, Level_1.Level.ONE_FACTOR);
        SetUserAndGroupsHeaders_1.default(res, username, groupsAndEmails.groups);
    });
}
exports.default = default_1;
//# sourceMappingURL=GetBasicAuth.js.map