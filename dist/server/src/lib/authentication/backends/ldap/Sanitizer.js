"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function contains(a, character) {
    return a.indexOf(character) > -1;
}
function containsOneOf(s, characters) {
    return characters
        .map((character) => { return contains(s, character); })
        .reduce((acc, current) => { return acc || current; }, false);
}
class Sanitizer {
    static sanitize(input) {
        const forbiddenChars = [",", "\\", "'", "#", "+", "<", ">", ";", "\"", "="];
        if (containsOneOf(input, forbiddenChars)) {
            throw new Error("Input containing unsafe characters.");
        }
        if (input != input.trim()) {
            throw new Error("Input has unexpected spaces.");
        }
        return input;
    }
}
exports.Sanitizer = Sanitizer;
//# sourceMappingURL=Sanitizer.js.map