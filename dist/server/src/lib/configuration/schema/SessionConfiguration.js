"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function complete(configuration) {
    const newConfiguration = (configuration) ? JSON.parse(JSON.stringify(configuration)) : {};
    if (!newConfiguration.name) {
        newConfiguration.name = "authelia_session";
    }
    if (!newConfiguration.expiration) {
        newConfiguration.expiration = 3600000;
    }
    if (!newConfiguration.inactivity) {
        newConfiguration.inactivity = undefined;
    }
    return newConfiguration;
}
exports.complete = complete;
//# sourceMappingURL=SessionConfiguration.js.map