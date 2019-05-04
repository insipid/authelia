"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Session_1 = require("./Session");
const SafeSession_1 = require("./SafeSession");
class SessionFactory {
    constructor(ldapConfiguration, connectorFactory, logger) {
        this.config = ldapConfiguration;
        this.connectorFactory = connectorFactory;
        this.logger = logger;
    }
    create(userDN, password) {
        const connector = this.connectorFactory.create();
        return new SafeSession_1.SafeSession(new Session_1.Session(userDN, password, this.config, connector, this.logger), this.logger);
    }
}
exports.SessionFactory = SessionFactory;
//# sourceMappingURL=SessionFactory.js.map