"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SessionConfigurationBuilder_1 = require("../configuration/SessionConfigurationBuilder");
const Path = require("path");
const Express = require("express");
const BodyParser = require("body-parser");
const RestApi_1 = require("./RestApi");
const WithHeadersLogged_1 = require("./middlewares/WithHeadersLogged");
const Helmet = require("helmet");
const addRequestId = require("express-request-id")();
const TRUST_PROXY = "trust proxy";
const X_POWERED_BY = "x-powered-by";
class Configurator {
    static configure(config, app, vars, deps) {
        const publicHtmlDirectory = Path.resolve(__dirname, "../../public_html");
        const expressSessionOptions = SessionConfigurationBuilder_1.SessionConfigurationBuilder.build(config, deps);
        app.use(Express.static(publicHtmlDirectory));
        app.use(BodyParser.urlencoded({ extended: false }));
        app.use(BodyParser.json());
        app.use(deps.session(expressSessionOptions));
        app.use(addRequestId);
        app.use(WithHeadersLogged_1.WithHeadersLogged.middleware(vars.logger));
        app.disable(X_POWERED_BY);
        app.enable(TRUST_PROXY);
        app.use(Helmet());
        app.use(function (req, res, next) {
            if (!req.session) {
                return next(new Error("No session available."));
            }
            next();
        });
        RestApi_1.RestApi.setup(app, vars);
    }
}
exports.Configurator = Configurator;
//# sourceMappingURL=Configurator.js.map