"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../../constants");
function default_1(res, username, groups) {
    if (username)
        res.setHeader(constants_1.HEADER_REMOTE_USER, username);
    if (groups instanceof Array)
        res.setHeader(constants_1.HEADER_REMOTE_GROUPS, groups.join(","));
}
exports.default = default_1;
//# sourceMappingURL=SetUserAndGroupsHeaders.js.map