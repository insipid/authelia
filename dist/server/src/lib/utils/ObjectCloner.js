"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ObjectCloner {
    static clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
}
exports.ObjectCloner = ObjectCloner;
//# sourceMappingURL=ObjectCloner.js.map