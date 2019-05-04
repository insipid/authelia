"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class U2fHandler {
    constructor(u2f) {
        this.u2f = u2f;
    }
    request(appId, keyHandle) {
        return this.u2f.request(appId, keyHandle);
    }
    checkRegistration(registrationRequest, registrationResponse) {
        return this.u2f.checkRegistration(registrationRequest, registrationResponse);
    }
    checkSignature(signatureRequest, signatureResponse, publicKey) {
        return this.u2f.checkSignature(signatureRequest, signatureResponse, publicKey);
    }
}
exports.U2fHandler = U2fHandler;
//# sourceMappingURL=U2fHandler.js.map