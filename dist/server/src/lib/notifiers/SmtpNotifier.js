"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractEmailNotifier_1 = require("../notifiers/AbstractEmailNotifier");
class SmtpNotifier extends AbstractEmailNotifier_1.AbstractEmailNotifier {
    constructor(options, mailSender) {
        super();
        this.mailSender = mailSender;
        this.sender = options.sender;
    }
    sendEmail(to, subject, content) {
        const mailOptions = {
            from: this.sender,
            to: to,
            subject: subject,
            html: content
        };
        const that = this;
        return this.mailSender.send(mailOptions);
    }
}
exports.SmtpNotifier = SmtpNotifier;
//# sourceMappingURL=SmtpNotifier.js.map