"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const Express = require("express");
const ConfigurationParser_1 = require("./configuration/ConfigurationParser");
const GlobalLogger_1 = require("./logging/GlobalLogger");
const RequestLogger_1 = require("./logging/RequestLogger");
const ServerVariablesInitializer_1 = require("./ServerVariablesInitializer");
const Configurator_1 = require("./web_server/Configurator");
const constants_1 = require("./constants");
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}
class Server {
    constructor(deps) {
        this.globalLogger = new GlobalLogger_1.GlobalLogger(deps.winston);
        this.requestLogger = new RequestLogger_1.RequestLogger(deps.winston);
    }
    displayConfigurations(configuration) {
        const displayableConfiguration = clone(configuration);
        const STARS = "*****";
        if (displayableConfiguration.authentication_backend.ldap) {
            displayableConfiguration.authentication_backend.ldap.password = STARS;
        }
        displayableConfiguration.session.secret = STARS;
        if (displayableConfiguration.notifier && displayableConfiguration.notifier.email)
            displayableConfiguration.notifier.email.password = STARS;
        if (displayableConfiguration.notifier && displayableConfiguration.notifier.smtp)
            displayableConfiguration.notifier.smtp.password = STARS;
        if (displayableConfiguration.duo_api) {
            displayableConfiguration.duo_api.secret_key = STARS;
        }
        this.globalLogger.debug("User configuration is %s", JSON.stringify(displayableConfiguration, undefined, 2));
    }
    setup(config, app, deps) {
        return ServerVariablesInitializer_1.ServerVariablesInitializer.initialize(config, this.globalLogger, this.requestLogger, deps)
            .then(function (vars) {
            app.set(constants_1.GET_VARIABLE_KEY, vars);
            return Configurator_1.Configurator.configure(config, app, vars, deps);
        });
    }
    startServer(app, port) {
        const that = this;
        that.globalLogger.info("Starting Authelia...");
        return new Bluebird((resolve, reject) => {
            this.httpServer = app.listen(port, function (err) {
                that.globalLogger.info("Listening on port %d...", port);
                resolve();
            });
        });
    }
    start(configuration, deps) {
        const that = this;
        const app = Express();
        const appConfiguration = ConfigurationParser_1.ConfigurationParser.parse(configuration);
        deps.winston.level = appConfiguration.logs_level;
        this.displayConfigurations(appConfiguration);
        return this.setup(appConfiguration, app, deps)
            .then(function () {
            return that.startServer(app, appConfiguration.port);
        });
    }
    stop() {
        this.httpServer.close();
    }
}
exports.default = Server;
//# sourceMappingURL=Server.js.map