"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DomainExtractor_1 = require("./DomainExtractor");
function BelongToDomain(url, domain) {
    const urlDomain = DomainExtractor_1.DomainExtractor.fromUrl(url);
    if (!urlDomain)
        return false;
    const idx = urlDomain.indexOf(domain);
    return idx + domain.length == urlDomain.length;
}
exports.BelongToDomain = BelongToDomain;
//# sourceMappingURL=BelongToDomain.js.map