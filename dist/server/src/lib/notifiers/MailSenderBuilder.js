"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MailSender_1 = require("./MailSender");
class MailSenderBuilder {
    constructor(nodemailer) {
        this.nodemailer = nodemailer;
    }
    buildEmail(options) {
        const emailOptions = {
            service: options.service,
            auth: {
                user: options.username,
                pass: options.password
            }
        };
        return new MailSender_1.MailSender(emailOptions, this.nodemailer);
    }
    buildSmtp(options) {
        const smtpOptions = {
            host: options.host,
            port: options.port,
            secure: options.secure,
        };
        if (options.username && options.password) {
            smtpOptions.auth = {
                user: options.username,
                pass: options.password
            };
        }
        return new MailSender_1.MailSender(smtpOptions, this.nodemailer);
    }
}
exports.MailSenderBuilder = MailSenderBuilder;
//# sourceMappingURL=MailSenderBuilder.js.map