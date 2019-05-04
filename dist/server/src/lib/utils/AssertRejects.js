"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(fn, expectedErrorType = Error, logs = false) {
    fn().then(() => {
        throw new Error("Should reject");
    }, (err) => {
        if (!(err instanceof expectedErrorType)) {
            throw new Error(`Received error ${typeof err} != Expected error ${expectedErrorType}`);
        }
        if (logs)
            console.error(err);
    });
}
exports.default = default_1;
//# sourceMappingURL=AssertRejects.js.map