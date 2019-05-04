"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BluebirdPromise = require("bluebird");
const RandomString = require("randomstring");
const Util = require("util");
const crypt = require("crypt3");
class HashGenerator {
    static ssha512(password, rounds = 500000, salt) {
        const _salt = Util.format("$6$rounds=%d$%s", rounds, (salt) ? salt : RandomString.generate(16));
        const cryptAsync = BluebirdPromise.promisify(crypt);
        return cryptAsync(password, _salt)
            .then(function (hash) {
            return BluebirdPromise.resolve(Util.format("{CRYPT}%s", hash));
        });
    }
}
exports.HashGenerator = HashGenerator;
//# sourceMappingURL=HashGenerator.js.map