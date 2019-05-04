"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function complete(configuration) {
    const newConfiguration = (configuration) ? JSON.parse(JSON.stringify(configuration)) : {};
    if (!newConfiguration.local && !newConfiguration.mongo) {
        newConfiguration.local = {
            in_memory: true
        };
    }
    return newConfiguration;
}
exports.complete = complete;
//# sourceMappingURL=StorageConfiguration.js.map