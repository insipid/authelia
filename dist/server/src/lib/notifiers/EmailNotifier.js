"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AbstractEmailNotifier_1 = require("../notifiers/AbstractEmailNotifier");
class EmailNotifier extends AbstractEmailNotifier_1.AbstractEmailNotifier {
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
        return this.mailSender.send(mailOptions);
    }
}
exports.EmailNotifier = EmailNotifier;
//# sourceMappingURL=EmailNotifier.js.map