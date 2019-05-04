"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TOTP_ENCODING = "base32";
const WINDOW = 1;
class TotpHandler {
    constructor(speakeasy) {
        this.speakeasy = speakeasy;
    }
    generate(label, issuer) {
        const secret = this.speakeasy.generateSecret({
            otpauth_url: false
        });
        secret.otpauth_url = this.speakeasy.otpauthURL({
            secret: secret.ascii,
            label: label,
            issuer: issuer
        });
        return secret;
    }
    validate(token, secret) {
        return this.speakeasy.totp.verify({
            secret: secret,
            encoding: TOTP_ENCODING,
            token: token,
            window: WINDOW
        });
    }
}
exports.TotpHandler = TotpHandler;
//# sourceMappingURL=TotpHandler.js.map