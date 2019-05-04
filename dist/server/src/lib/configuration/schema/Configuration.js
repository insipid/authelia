"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AclConfiguration_1 = require("./AclConfiguration");
const AuthenticationBackendConfiguration_1 = require("./AuthenticationBackendConfiguration");
const NotifierConfiguration_1 = require("./NotifierConfiguration");
const RegulationConfiguration_1 = require("./RegulationConfiguration");
const SessionConfiguration_1 = require("./SessionConfiguration");
const StorageConfiguration_1 = require("./StorageConfiguration");
const TotpConfiguration_1 = require("./TotpConfiguration");
function complete(configuration) {
    const newConfiguration = JSON.parse(JSON.stringify(configuration));
    const errors = [];
    const [acls, aclsErrors] = AclConfiguration_1.complete(newConfiguration.access_control);
    newConfiguration.access_control = acls;
    if (aclsErrors.length > 0) {
        errors.concat(aclsErrors);
    }
    const [backend, error] = AuthenticationBackendConfiguration_1.complete(newConfiguration.authentication_backend);
    if (error)
        errors.push(error);
    newConfiguration.authentication_backend = backend;
    if (!newConfiguration.logs_level) {
        newConfiguration.logs_level = "info";
    }
    const [notifier, notifierError] = NotifierConfiguration_1.complete(newConfiguration.notifier);
    newConfiguration.notifier = notifier;
    if (notifierError)
        errors.push(notifierError);
    if (!newConfiguration.port) {
        newConfiguration.port = 8080;
    }
    newConfiguration.regulation = RegulationConfiguration_1.complete(newConfiguration.regulation);
    newConfiguration.session = SessionConfiguration_1.complete(newConfiguration.session);
    newConfiguration.storage = StorageConfiguration_1.complete(newConfiguration.storage);
    newConfiguration.totp = TotpConfiguration_1.complete(newConfiguration.totp);
    return [newConfiguration, errors];
}
exports.complete = complete;
//# sourceMappingURL=Configuration.js.map