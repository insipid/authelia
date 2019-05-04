"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function complete(configuration) {
    const newConfiguration = (configuration)
        ? JSON.parse(JSON.stringify(configuration)) : {};
    if (!newConfiguration.default_policy) {
        newConfiguration.default_policy = "bypass";
    }
    if (!newConfiguration.rules) {
        newConfiguration.rules = [];
    }
    if (newConfiguration.rules.length > 0) {
        const errors = [];
        newConfiguration.rules.forEach((r, idx) => {
            if (r.subject && !r.subject.match(/^(user|group):[a-zA-Z0-9]+$/)) {
                errors.push(`Rule ${idx} has wrong subject. It should be starting with user: or group:.`);
            }
        });
        if (errors.length > 0) {
            return [newConfiguration, errors];
        }
    }
    return [newConfiguration, []];
}
exports.complete = complete;
//# sourceMappingURL=AclConfiguration.js.map