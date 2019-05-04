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
function default_1(vars) {
    return function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!(req.body && req.body.method)) {
                    throw new Error("No 'method' key in request body");
                }
                const authSession = AuthenticationSessionHandler_1.AuthenticationSessionHandler.get(req, vars.logger);
                yield vars.userDataStore.savePrefered2FAMethod(authSession.userid, req.body.method);
                res.status(204);
                res.send();
            }
            catch (err) {
                ErrorReplies.replyWithError200(req, res, vars.logger, UserMessage.OPERATION_FAILED)(err);
            }
        });
    };
}
exports.default = default_1;
//# sourceMappingURL=Post.js.map