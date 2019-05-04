"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function IsRedirectionSafe(vars, url) {
    const urlInDomain = url.hostname.endsWith(vars.config.session.domain);
    const protocolIsHttps = url.protocol === "https:";
    return urlInDomain && protocolIsHttps;
}
exports.default = IsRedirectionSafe;
//# sourceMappingURL=IsRedirectionSafe.js.map