"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ObjectPath = require("object-path");
function default_1(req, header) {
    return ObjectPath.has(req, "headers." + header);
}
exports.default = default_1;
//# sourceMappingURL=HasHeader.js.map