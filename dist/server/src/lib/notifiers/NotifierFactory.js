"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FileSystemNotifier_1 = require("./FileSystemNotifier");
const EmailNotifier_1 = require("./EmailNotifier");
const SmtpNotifier_1 = require("./SmtpNotifier");
class NotifierFactory {
    static build(options, mailSenderBuilder) {
        if ("email" in options) {
            const mailSender = mailSenderBuilder.buildEmail(options.email);
            return new EmailNotifier_1.EmailNotifier(options.email, mailSender);
        }
        else if ("smtp" in options) {
            const mailSender = mailSenderBuilder.buildSmtp(options.smtp);
            return new SmtpNotifier_1.SmtpNotifier(options.smtp, mailSender);
        }
        else if ("filesystem" in options) {
            return new FileSystemNotifier_1.FileSystemNotifier(options.filesystem);
        }
        else {
            throw new Error("No available notifier option detected.");
        }
    }
}
exports.NotifierFactory = NotifierFactory;
//# sourceMappingURL=NotifierFactory.js.map