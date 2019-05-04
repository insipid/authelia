"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const Yaml = require("yamljs");
const HashGenerator_1 = require("../../../utils/HashGenerator");
const ReadWriteQueue_1 = require("./ReadWriteQueue");
const AuthenticationError_1 = require("../../AuthenticationError");
const loadAsync = Bluebird.promisify(Yaml.load);
class FileUsersDatabase {
    constructor(configuration) {
        this.configuration = configuration;
        this.queue = new ReadWriteQueue_1.ReadWriteQueue(this.configuration.path);
    }
    readDatabase() {
        return new Bluebird((resolve, reject) => {
            this.queue.read((err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data);
                this.queue.next();
            });
        })
            .then((content) => {
            const database = Yaml.parse(content);
            if (!database) {
                return Bluebird.reject(new Error("Unable to parse YAML file."));
            }
            return Bluebird.resolve(database);
        });
    }
    checkUserExists(database, username) {
        if (!(username in database.users)) {
            return Bluebird.reject(new Error(`User ${username} does not exist in database.`));
        }
        return Bluebird.resolve();
    }
    checkPassword(database, username, password) {
        const storedHash = database.users[username].password;
        const matches = storedHash.match(/rounds=([0-9]+)\$([a-zA-z0-9./]+)\$/);
        if (!(matches && matches.length == 3)) {
            return Bluebird.reject(new Error("Unable to detect the hash salt and rounds. " +
                "Make sure the password is hashed with SSHA512."));
        }
        const rounds = parseInt(matches[1]);
        const salt = matches[2];
        return HashGenerator_1.HashGenerator.ssha512(password, rounds, salt)
            .then((hash) => {
            if (hash !== storedHash) {
                return Bluebird.reject(new AuthenticationError_1.default("Wrong username/password."));
            }
            return Bluebird.resolve();
        });
    }
    retrieveEmails(database, username) {
        if (!("email" in database.users[username])) {
            return Bluebird.reject(new Error(`User ${username} has no email address.`));
        }
        return Bluebird.resolve([database.users[username].email]);
    }
    retrieveGroups(database, username) {
        if (!("groups" in database.users[username])) {
            return Bluebird.resolve([]);
        }
        return Bluebird.resolve(database.users[username].groups);
    }
    replacePassword(database, username, newPassword) {
        const that = this;
        return HashGenerator_1.HashGenerator.ssha512(newPassword)
            .then((hash) => {
            database.users[username].password = hash;
            const str = Yaml.stringify(database, 4, 2);
            return Bluebird.resolve(str);
        })
            .then((content) => {
            return new Bluebird((resolve, reject) => {
                that.queue.write(content, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                    that.queue.next();
                });
            });
        });
    }
    checkUserPassword(username, password) {
        return this.readDatabase()
            .then((database) => {
            return this.checkUserExists(database, username)
                .then(() => this.checkPassword(database, username, password))
                .then(() => {
                return Bluebird.join(this.retrieveEmails(database, username), this.retrieveGroups(database, username)).spread((emails, groups) => {
                    return { emails: emails, groups: groups };
                });
            });
        });
    }
    getEmails(username) {
        return this.readDatabase()
            .then((database) => {
            return this.checkUserExists(database, username)
                .then(() => this.retrieveEmails(database, username));
        });
    }
    getGroups(username) {
        return this.readDatabase()
            .then((database) => {
            return this.checkUserExists(database, username)
                .then(() => this.retrieveGroups(database, username));
        });
    }
    updatePassword(username, newPassword) {
        return this.readDatabase()
            .then((database) => {
            return this.checkUserExists(database, username)
                .then(() => this.replacePassword(database, username, newPassword));
        });
    }
}
exports.FileUsersDatabase = FileUsersDatabase;
//# sourceMappingURL=FileUsersDatabase.js.map