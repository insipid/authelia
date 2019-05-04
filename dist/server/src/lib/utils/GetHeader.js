"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ObjectPath = require("object-path");
const constants_1 = require("../constants");
function default_1(req, header) {
    const variables = req.app.get(constants_1.GET_VARIABLE_KEY);
    if (!variables)
        throw new Error("There are no server variables set.");
    const value = ObjectPath.get(req, "headers." + header, undefined);
    variables.logger.debug(req, "Header %s is set to %s", header, value);
    return value;
}
exports.default = default_1;
//# sourceMappingURL=GetHeader.js.map