"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BluebirdPromise = require("bluebird");
const Nodemailer = require("nodemailer");
const TotpHandler_1 = require("./authentication/totp/TotpHandler");
const NotifierFactory_1 = require("./notifiers/NotifierFactory");
const MailSenderBuilder_1 = require("./notifiers/MailSenderBuilder");
const LdapUsersDatabase_1 = require("./authentication/backends/ldap/LdapUsersDatabase");
const ConnectorFactory_1 = require("./authentication/backends/ldap/connector/ConnectorFactory");
const UserDataStore_1 = require("./storage/UserDataStore");
const Regulator_1 = require("./regulation/Regulator");
const CollectionFactoryFactory_1 = require("./storage/CollectionFactoryFactory");
const MongoClient_1 = require("./connectors/mongo/MongoClient");
const SessionFactory_1 = require("./authentication/backends/ldap/SessionFactory");
const FileUsersDatabase_1 = require("./authentication/backends/file/FileUsersDatabase");
const Authorizer_1 = require("./authorization/Authorizer");
class UserDataStoreFactory {
    static create(config, globalLogger) {
        if (config.storage.local) {
            const nedbOptions = {
                filename: config.storage.local.path,
                inMemoryOnly: config.storage.local.in_memory
            };
            const collectionFactory = CollectionFactoryFactory_1.CollectionFactoryFactory.createNedb(nedbOptions);
            return BluebirdPromise.resolve(new UserDataStore_1.UserDataStore(collectionFactory));
        }
        else if (config.storage.mongo) {
            const mongoClient = new MongoClient_1.MongoClient(config.storage.mongo, globalLogger);
            const collectionFactory = CollectionFactoryFactory_1.CollectionFactoryFactory.createMongo(mongoClient);
            return BluebirdPromise.resolve(new UserDataStore_1.UserDataStore(collectionFactory));
        }
        return BluebirdPromise.reject(new Error("Storage backend incorrectly configured."));
    }
}
class ServerVariablesInitializer {
    static createUsersDatabase(config, deps) {
        if (config.authentication_backend.ldap) {
            const ldapConfig = config.authentication_backend.ldap;
            return new LdapUsersDatabase_1.LdapUsersDatabase(new SessionFactory_1.SessionFactory(ldapConfig, new ConnectorFactory_1.ConnectorFactory(ldapConfig, deps.ldapjs), deps.winston), ldapConfig);
        }
        else if (config.authentication_backend.file) {
            return new FileUsersDatabase_1.FileUsersDatabase(config.authentication_backend.file);
        }
    }
    static initialize(config, globalLogger, requestLogger, deps) {
        const mailSenderBuilder = new MailSenderBuilder_1.MailSenderBuilder(Nodemailer);
        const notifier = NotifierFactory_1.NotifierFactory.build(config.notifier, mailSenderBuilder);
        const authorizer = new Authorizer_1.Authorizer(config.access_control, deps.winston);
        const totpHandler = new TotpHandler_1.TotpHandler(deps.speakeasy);
        const usersDatabase = this.createUsersDatabase(config, deps);
        return UserDataStoreFactory.create(config, globalLogger)
            .then(function (userDataStore) {
            const regulator = new Regulator_1.Regulator(userDataStore, config.regulation.max_retries, config.regulation.find_time, config.regulation.ban_time);
            const variables = {
                authorizer: authorizer,
                config: config,
                usersDatabase: usersDatabase,
                logger: requestLogger,
                notifier: notifier,
                regulator: regulator,
                totpHandler: totpHandler,
                u2f: deps.u2f,
                userDataStore: userDataStore
            };
            return BluebirdPromise.resolve(variables);
        });
    }
}
exports.ServerVariablesInitializer = ServerVariablesInitializer;
//# sourceMappingURL=ServerVariablesInitializer.js.map