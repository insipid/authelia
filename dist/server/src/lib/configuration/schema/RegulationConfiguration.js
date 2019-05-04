"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function complete(configuration) {
    const newConfiguration = (configuration) ? JSON.parse(JSON.stringify(configuration)) : {};
    if (!newConfiguration.max_retries) {
        newConfiguration.max_retries = 3;
    }
    if (!newConfiguration.find_time) {
        newConfiguration.find_time = 120;
    }
    if (!newConfiguration.ban_time) {
        newConfiguration.ban_time = 300;
    }
    return newConfiguration;
}
exports.complete = complete;
//# sourceMappingURL=RegulationConfiguration.js.map