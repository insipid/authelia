"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MultipleDomainMatcher {
    static match(domain, pattern) {
        if (pattern.startsWith("*") &&
            domain.endsWith(pattern.substr(1))) {
            return true;
        }
        else if (domain == pattern) {
            return true;
        }
    }
}
exports.MultipleDomainMatcher = MultipleDomainMatcher;
//# sourceMappingURL=MultipleDomainMatcher.js.map