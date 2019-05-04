"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Connector_1 = require("./Connector");
class ConnectorFactory {
    constructor(configuration, ldapjs) {
        this.configuration = configuration;
        this.ldapjs = ldapjs;
    }
    create() {
        return new Connector_1.Connector(this.configuration.url, this.ldapjs);
    }
}
exports.ConnectorFactory = ConnectorFactory;
//# sourceMappingURL=ConnectorFactory.js.map