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
const URLParse = require("url-parse");
const IsRedirectionSafe_1 = require("../../../lib/utils/IsRedirectionSafe");
const GetHeader_1 = require("../../utils/GetHeader");
const constants_1 = require("../../constants");
function default_1(vars) {
    return function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let redirectUrl = GetHeader_1.default(req, constants_1.HEADER_X_TARGET_URL);
            if (!redirectUrl && vars.config.default_redirection_url) {
                redirectUrl = vars.config.default_redirection_url;
            }
            if ((redirectUrl && !IsRedirectionSafe_1.default(vars, new URLParse(redirectUrl)))
                || !redirectUrl) {
                res.status(204);
                res.send();
                return;
            }
            res.json({ redirect: redirectUrl });
        });
    };
}
exports.default = default_1;
//# sourceMappingURL=redirect.js.map