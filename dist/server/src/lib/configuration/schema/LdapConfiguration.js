"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function complete(configuration) {
    const newConfiguration = (configuration) ? JSON.parse(JSON.stringify(configuration)) : {};
    if (!newConfiguration.users_filter) {
        newConfiguration.users_filter = "cn={0}";
    }
    if (!newConfiguration.groups_filter) {
        newConfiguration.groups_filter = "member={dn}";
    }
    if (!newConfiguration.group_name_attribute) {
        newConfiguration.group_name_attribute = "cn";
    }
    if (!newConfiguration.mail_attribute) {
        newConfiguration.mail_attribute = "mail";
    }
    return newConfiguration;
}
exports.complete = complete;
//# sourceMappingURL=LdapConfiguration.js.map