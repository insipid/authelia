"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BluebirdPromise = require("bluebird");
const util = require("util");
const Fs = require("fs");
class FileSystemNotifier {
    constructor(options) {
        this.filename = options.filename;
    }
    notify(to, subject, link) {
        const content = util.format("Date: %s\nEmail: %s\nSubject: %s\nLink: %s", new Date().toString(), to, subject, link);
        const writeFilePromised = BluebirdPromise.promisify(Fs.writeFile);
        return writeFilePromised(this.filename, content);
    }
}
exports.FileSystemNotifier = FileSystemNotifier;
//# sourceMappingURL=FileSystemNotifier.js.map