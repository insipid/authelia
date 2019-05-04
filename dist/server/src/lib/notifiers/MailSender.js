"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BluebirdPromise = require("bluebird");
class MailSender {
    constructor(options, nodemailer) {
        this.transporter = nodemailer.createTransport(options);
    }
    verify() {
        const that = this;
        return new BluebirdPromise(function (resolve, reject) {
            that.transporter.verify(function (error, success) {
                if (error) {
                    reject(new Error("Unable to connect to SMTP server. \
  Please check the service is running and your credentials are correct."));
                    return;
                }
                resolve();
            });
        });
    }
    send(mailOptions) {
        const that = this;
        return new BluebirdPromise(function (resolve, reject) {
            that.transporter.sendMail(mailOptions, (error, data) => {
                if (error) {
                    reject(new Error("Error while sending email: " + error.message));
                    return;
                }
                resolve();
            });
        });
    }
}
exports.MailSender = MailSender;
//# sourceMappingURL=MailSender.js.map