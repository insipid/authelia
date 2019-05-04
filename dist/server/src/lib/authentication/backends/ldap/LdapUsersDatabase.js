"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const Exceptions = require("../../../Exceptions");
const AuthenticationError_1 = require("../../AuthenticationError");
class LdapUsersDatabase {
    constructor(sessionFactory, configuration) {
        this.sessionFactory = sessionFactory;
        this.configuration = configuration;
    }
    withSession(username, password, cb) {
        const session = this.sessionFactory.create(username, password);
        return session.open()
            .then(() => cb(session))
            .finally(() => session.close());
    }
    checkUserPassword(username, password) {
        const that = this;
        function verifyUserPassword(userDN) {
            return that.withSession(userDN, password, (session) => Bluebird.resolve());
        }
        function getInfo(session) {
            return Bluebird.join(session.searchGroups(username), session.searchEmails(username))
                .spread((groups, emails) => {
                return { groups: groups, emails: emails };
            });
        }
        return that.withSession(that.configuration.user, that.configuration.password, (session) => {
            return session.searchUserDn(username)
                .then(verifyUserPassword)
                .then(() => getInfo(session));
        })
            .catch((err) => Bluebird.reject(new AuthenticationError_1.default(err.message)));
    }
    getEmails(username) {
        const that = this;
        return that.withSession(that.configuration.user, that.configuration.password, (session) => {
            return session.searchEmails(username);
        })
            .catch((err) => Bluebird.reject(new Exceptions.LdapError("Failed during email retrieval: " + err.message)));
    }
    getGroups(username) {
        const that = this;
        return that.withSession(that.configuration.user, that.configuration.password, (session) => {
            return session.searchGroups(username);
        })
            .catch((err) => Bluebird.reject(new Exceptions.LdapError("Failed during email retrieval: " + err.message)));
    }
    updatePassword(username, newPassword) {
        const that = this;
        return that.withSession(that.configuration.user, that.configuration.password, (session) => {
            return session.modifyPassword(username, newPassword);
        })
            .catch(function (err) {
            return Bluebird.reject(new Exceptions.LdapError("Error while updating password: " + err.message));
        });
    }
}
exports.LdapUsersDatabase = LdapUsersDatabase;
//# sourceMappingURL=LdapUsersDatabase.js.map