"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function complete(configuration) {
    const newConfiguration = (configuration)
        ? JSON.parse(JSON.stringify(configuration)) : {};
    if (Object.keys(newConfiguration).length != 1) {
        return [
            newConfiguration,
            "Authentication backend must have one of the following keys:" +
                "`ldap` or `file`"
        ];
    }
    return [newConfiguration, undefined];
}
exports.complete = complete;
//# sourceMappingURL=AuthenticationBackendConfiguration.js.map