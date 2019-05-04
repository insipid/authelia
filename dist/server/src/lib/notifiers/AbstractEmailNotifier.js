"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Fs = require("fs");
const Path = require("path");
const Ejs = require("ejs");
const email_template = Fs.readFileSync(Path.join(__dirname, "../../resources/email-template.ejs"), "UTF-8");
class AbstractEmailNotifier {
    notify(to, subject, link) {
        const d = {
            url: link,
            button_title: "Continue",
            title: subject
        };
        return this.sendEmail(to, subject, Ejs.render(email_template, d));
    }
}
exports.AbstractEmailNotifier = AbstractEmailNotifier;
//# sourceMappingURL=AbstractEmailNotifier.js.map