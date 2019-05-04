"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function complete(configuration) {
    const newConfiguration = (configuration) ? JSON.parse(JSON.stringify(configuration)) : {};
    if (Object.keys(newConfiguration).length == 0)
        newConfiguration.filesystem = { filename: "/tmp/authelia/notification.txt" };
    const ERROR = "Notifier must have one of the following keys: 'filesystem', 'email' or 'smtp'";
    if (Object.keys(newConfiguration).length != 1)
        return [newConfiguration, ERROR];
    const key = Object.keys(newConfiguration)[0];
    if (key != "filesystem" && key != "smtp" && key != "email")
        return [newConfiguration, ERROR];
    return [newConfiguration, undefined];
}
exports.complete = complete;
//# sourceMappingURL=NotifierConfiguration.js.map