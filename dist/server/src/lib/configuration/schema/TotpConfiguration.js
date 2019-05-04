"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function complete(configuration) {
    const newConfiguration = (configuration) ? JSON.parse(JSON.stringify(configuration)) : {};
    if (!newConfiguration.issuer) {
        newConfiguration.issuer = "authelia.com";
    }
    return newConfiguration;
}
exports.complete = complete;
//# sourceMappingURL=TotpConfiguration.js.map