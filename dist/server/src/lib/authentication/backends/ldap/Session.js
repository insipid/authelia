"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BluebirdPromise = require("bluebird");
const exceptions = require("../../../Exceptions");
const Util = require("util");
const HashGenerator_1 = require("../../../utils/HashGenerator");
class Session {
    constructor(userDN, password, options, connector, logger) {
        this.options = options;
        this.logger = logger;
        this.userDN = userDN;
        this.password = password;
        this.connector = connector;
        this.groupsSearchBase = (this.options.additional_groups_dn)
            ? Util.format("%s,%s", this.options.additional_groups_dn, this.options.base_dn)
            : this.options.base_dn;
        this.usersSearchBase = (this.options.additional_users_dn)
            ? Util.format("%s,%s", this.options.additional_users_dn, this.options.base_dn)
            : this.options.base_dn;
    }
    open() {
        this.logger.debug("LDAP: Bind user '%s'", this.userDN);
        return this.connector.bindAsync(this.userDN, this.password)
            .error(function (err) {
            return BluebirdPromise.reject(new exceptions.LdapBindError(err.message));
        });
    }
    close() {
        this.logger.debug("LDAP: Unbind user '%s'", this.userDN);
        return this.connector.unbindAsync()
            .error(function (err) {
            return BluebirdPromise.reject(new exceptions.LdapBindError(err.message));
        });
    }
    createGroupsFilter(userGroupsFilter, username) {
        if (userGroupsFilter.indexOf("{0}") > 0) {
            return BluebirdPromise.resolve(userGroupsFilter.replace("{0}", username));
        }
        else if (userGroupsFilter.indexOf("{dn}") > 0) {
            return this.searchUserDn(username)
                .then(function (userDN) {
                return BluebirdPromise.resolve(userGroupsFilter.replace("{dn}", userDN));
            });
        }
        else if (userGroupsFilter.indexOf("{uid}") > 0) {
            return this.searchUserUid(username)
                .then(function (userUid) {
                return BluebirdPromise.resolve(userGroupsFilter.replace("{uid}", userUid));
            });
        }
        return BluebirdPromise.resolve(userGroupsFilter);
    }
    searchGroups(username) {
        const that = this;
        return this.createGroupsFilter(this.options.groups_filter, username)
            .then(function (groupsFilter) {
            that.logger.debug("Computed groups filter is %s", groupsFilter);
            const query = {
                scope: "sub",
                attributes: [that.options.group_name_attribute],
                filter: groupsFilter
            };
            return that.connector.searchAsync(that.groupsSearchBase, query);
        })
            .then(function (docs) {
            const groups = docs.map((doc) => { return doc.cn; });
            that.logger.debug("LDAP: groups of user %s are [%s]", username, groups.join(","));
            return BluebirdPromise.resolve(groups);
        });
    }
    searchUserAttribute(username, attribute) {
        const that = this;
        const filter = this.options.users_filter.replace("{0}", username);
        this.logger.debug("Computed users filter is %s", filter);
        const query = {
            scope: "sub",
            sizeLimit: 1,
            attributes: [attribute],
            filter: filter
        };
        that.logger.debug("LDAP: searching for user %s of %s", attribute, username);
        return that.connector.searchAsync(this.usersSearchBase, query)
            .then(function (users) {
            if (users.length > 0) {
                that.logger.debug("LDAP: retrieved user %s is %s", attribute, users[0][attribute]);
                return BluebirdPromise.resolve(users[0][attribute]);
            }
            return BluebirdPromise.reject(new Error(Util.format("No user %s found for user '%s'", attribute, username)));
        });
    }
    searchUserDn(username) {
        return this.searchUserAttribute(username, "dn");
    }
    searchUserUid(username) {
        return this.searchUserAttribute(username, "uid");
    }
    searchEmails(username) {
        const that = this;
        const query = {
            scope: "base",
            sizeLimit: 1,
            attributes: [this.options.mail_attribute]
        };
        return this.searchUserDn(username)
            .then(function (userDN) {
            return that.connector.searchAsync(userDN, query);
        })
            .then(function (docs) {
            const emails = docs
                .filter((d) => { return typeof d[that.options.mail_attribute] === "string"; })
                .map((d) => { return d[that.options.mail_attribute]; });
            that.logger.debug("LDAP: emails of user '%s' are %s", username, emails);
            return BluebirdPromise.resolve(emails);
        })
            .catch(function (err) {
            return BluebirdPromise.reject(new exceptions.LdapError("Error while searching emails. " + err.stack));
        });
    }
    modifyPassword(username, newPassword) {
        const that = this;
        this.logger.debug("LDAP: update password of user '%s'", username);
        return this.searchUserDn(username)
            .then(function (userDN) {
            return BluebirdPromise.join(HashGenerator_1.HashGenerator.ssha512(newPassword), BluebirdPromise.resolve(userDN));
        })
            .then(function (res) {
            const change = {
                operation: "replace",
                modification: {
                    userPassword: res[0]
                }
            };
            that.logger.debug("Password new='%s'", change.modification.userPassword);
            return that.connector.modifyAsync(res[1], change);
        })
            .then(function () {
            return that.connector.unbindAsync();
        });
    }
}
exports.Session = Session;
//# sourceMappingURL=Session.js.map