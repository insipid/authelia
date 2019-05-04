"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DomainExtractor {
    static fromUrl(url) {
        if (!url)
            return;
        const matches = url.match(/(https?:\/\/)?([a-zA-Z0-9_.-]+).*/);
        if (matches.length > 2) {
            return matches[2];
        }
        return;
    }
}
exports.DomainExtractor = DomainExtractor;
//# sourceMappingURL=DomainExtractor.js.map