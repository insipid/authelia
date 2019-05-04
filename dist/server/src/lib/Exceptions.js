"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LdapSearchError extends Error {
    constructor(message) {
        super(message);
        this.name = "LdapSearchError";
        Object.setPrototypeOf(this, LdapSearchError.prototype);
    }
}
exports.LdapSearchError = LdapSearchError;
class LdapBindError extends Error {
    constructor(message) {
        super(message);
        this.name = "LdapBindError";
        Object.setPrototypeOf(this, LdapBindError.prototype);
    }
}
exports.LdapBindError = LdapBindError;
class LdapError extends Error {
    constructor(message) {
        super(message);
        this.name = "LdapError";
        Object.setPrototypeOf(this, LdapError.prototype);
    }
}
exports.LdapError = LdapError;
class IdentityError extends Error {
    constructor(message) {
        super(message);
        this.name = "IdentityError";
        Object.setPrototypeOf(this, IdentityError.prototype);
    }
}
exports.IdentityError = IdentityError;
class AccessDeniedError extends Error {
    constructor(message) {
        super(message);
        this.name = "AccessDeniedError";
        Object.setPrototypeOf(this, AccessDeniedError.prototype);
    }
}
exports.AccessDeniedError = AccessDeniedError;
class AuthenticationRegulationError extends Error {
    constructor(message) {
        super(message);
        this.name = "AuthenticationRegulationError";
        Object.setPrototypeOf(this, AuthenticationRegulationError.prototype);
    }
}
exports.AuthenticationRegulationError = AuthenticationRegulationError;
class InvalidTOTPError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidTOTPError";
        Object.setPrototypeOf(this, InvalidTOTPError.prototype);
    }
}
exports.InvalidTOTPError = InvalidTOTPError;
class NotAuthenticatedError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotAuthenticatedError";
        Object.setPrototypeOf(this, NotAuthenticatedError.prototype);
    }
}
exports.NotAuthenticatedError = NotAuthenticatedError;
class NotAuthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotAuthenticatedError";
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }
}
exports.NotAuthorizedError = NotAuthorizedError;
class FirstFactorValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "FirstFactorValidationError";
        Object.setPrototypeOf(this, FirstFactorValidationError.prototype);
    }
}
exports.FirstFactorValidationError = FirstFactorValidationError;
class SecondFactorValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "SecondFactorValidationError";
        Object.setPrototypeOf(this, FirstFactorValidationError.prototype);
    }
}
exports.SecondFactorValidationError = SecondFactorValidationError;
//# sourceMappingURL=Exceptions.js.map