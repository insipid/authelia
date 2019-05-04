"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Get_1 = require("../routes/secondfactor/preferences/Get");
const Post_1 = require("../routes/secondfactor/preferences/Post");
const Post_2 = require("../routes/secondfactor/duo-push/Post");
const Get_2 = require("../routes/secondfactor/available/Get");
const FirstFactorPost = require("../routes/firstfactor/post");
const post_1 = require("../routes/logout/post");
const get_1 = require("../routes/state/get");
const VerifyGet = require("../routes/verify/Get");
const TOTPSignGet = require("../routes/secondfactor/totp/sign/post");
const IdentityCheckMiddleware = require("../IdentityCheckMiddleware");
const RegistrationHandler_1 = require("../routes/secondfactor/totp/identity/RegistrationHandler");
const RegistrationHandler_2 = require("../routes/secondfactor/u2f/identity/RegistrationHandler");
const PasswordResetHandler_1 = require("../routes/password-reset/identity/PasswordResetHandler");
const U2FSignPost = require("../routes/secondfactor/u2f/sign/post");
const U2FSignRequestGet = require("../routes/secondfactor/u2f/sign_request/get");
const U2FRegisterPost = require("../routes/secondfactor/u2f/register/post");
const U2FRegisterRequestGet = require("../routes/secondfactor/u2f/register_request/get");
const ResetPasswordFormPost = require("../routes/password-reset/form/post");
const Endpoints = require("../api");
const RequireValidatedFirstFactor_1 = require("./middlewares/RequireValidatedFirstFactor");
function setupTotp(app, vars) {
    app.post(Endpoints.SECOND_FACTOR_TOTP_POST, RequireValidatedFirstFactor_1.RequireValidatedFirstFactor.middleware(vars.logger), TOTPSignGet.default(vars));
    app.post(Endpoints.SECOND_FACTOR_TOTP_IDENTITY_START_POST, RequireValidatedFirstFactor_1.RequireValidatedFirstFactor.middleware(vars.logger));
    app.post(Endpoints.SECOND_FACTOR_TOTP_IDENTITY_FINISH_POST, RequireValidatedFirstFactor_1.RequireValidatedFirstFactor.middleware(vars.logger));
    IdentityCheckMiddleware.register(app, Endpoints.SECOND_FACTOR_TOTP_IDENTITY_START_POST, Endpoints.SECOND_FACTOR_TOTP_IDENTITY_FINISH_POST, new RegistrationHandler_1.default(vars.logger, vars.userDataStore, vars.totpHandler, vars.config.totp), vars);
}
function setupU2f(app, vars) {
    app.get(Endpoints.SECOND_FACTOR_U2F_SIGN_REQUEST_GET, RequireValidatedFirstFactor_1.RequireValidatedFirstFactor.middleware(vars.logger), U2FSignRequestGet.default(vars));
    app.post(Endpoints.SECOND_FACTOR_U2F_SIGN_POST, RequireValidatedFirstFactor_1.RequireValidatedFirstFactor.middleware(vars.logger), U2FSignPost.default(vars));
    app.get(Endpoints.SECOND_FACTOR_U2F_REGISTER_REQUEST_GET, RequireValidatedFirstFactor_1.RequireValidatedFirstFactor.middleware(vars.logger), U2FRegisterRequestGet.default(vars));
    app.post(Endpoints.SECOND_FACTOR_U2F_REGISTER_POST, RequireValidatedFirstFactor_1.RequireValidatedFirstFactor.middleware(vars.logger), U2FRegisterPost.default(vars));
    app.post(Endpoints.SECOND_FACTOR_U2F_IDENTITY_START_POST, RequireValidatedFirstFactor_1.RequireValidatedFirstFactor.middleware(vars.logger));
    app.post(Endpoints.SECOND_FACTOR_U2F_IDENTITY_FINISH_POST, RequireValidatedFirstFactor_1.RequireValidatedFirstFactor.middleware(vars.logger));
    IdentityCheckMiddleware.register(app, Endpoints.SECOND_FACTOR_U2F_IDENTITY_START_POST, Endpoints.SECOND_FACTOR_U2F_IDENTITY_FINISH_POST, new RegistrationHandler_2.default(vars.logger), vars);
}
function setupResetPassword(app, vars) {
    IdentityCheckMiddleware.register(app, Endpoints.RESET_PASSWORD_IDENTITY_START_GET, Endpoints.RESET_PASSWORD_IDENTITY_FINISH_GET, new PasswordResetHandler_1.default(vars.logger, vars.usersDatabase), vars);
    app.post(Endpoints.RESET_PASSWORD_FORM_POST, ResetPasswordFormPost.default(vars));
}
class RestApi {
    static setup(app, vars) {
        app.get(Endpoints.STATE_GET, get_1.default(vars));
        app.post(Endpoints.LOGOUT_POST, post_1.default(vars));
        app.get(Endpoints.VERIFY_GET, VerifyGet.default(vars));
        app.post(Endpoints.FIRST_FACTOR_POST, FirstFactorPost.default(vars));
        app.get(Endpoints.SECOND_FACTOR_PREFERENCES_GET, RequireValidatedFirstFactor_1.RequireValidatedFirstFactor.middleware(vars.logger), Get_1.default(vars));
        app.post(Endpoints.SECOND_FACTOR_PREFERENCES_POST, RequireValidatedFirstFactor_1.RequireValidatedFirstFactor.middleware(vars.logger), Post_1.default(vars));
        if (vars.config.duo_api) {
            app.post(Endpoints.SECOND_FACTOR_DUO_PUSH_POST, RequireValidatedFirstFactor_1.RequireValidatedFirstFactor.middleware(vars.logger), Post_2.default(vars));
        }
        app.get(Endpoints.SECOND_FACTOR_AVAILABLE_GET, RequireValidatedFirstFactor_1.RequireValidatedFirstFactor.middleware(vars.logger), Get_2.default(vars));
        setupTotp(app, vars);
        setupU2f(app, vars);
        setupResetPassword(app, vars);
    }
}
exports.RestApi = RestApi;
//# sourceMappingURL=RestApi.js.map