"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BluebirdPromise = require("bluebird");
const IDENTITY_VALIDATION_TOKENS_COLLECTION_NAME = "identity_validation_tokens";
const AUTHENTICATION_TRACES_COLLECTION_NAME = "authentication_traces";
const U2F_REGISTRATIONS_COLLECTION_NAME = "u2f_registrations";
const TOTP_SECRETS_COLLECTION_NAME = "totp_secrets";
const PREFERED_2FA_METHOD_COLLECTION_NAME = "prefered_2fa_method";
class UserDataStore {
    constructor(collectionFactory) {
        this.collectionFactory = collectionFactory;
        this.u2fSecretCollection = this.collectionFactory.build(U2F_REGISTRATIONS_COLLECTION_NAME);
        this.identityCheckTokensCollection = this.collectionFactory.build(IDENTITY_VALIDATION_TOKENS_COLLECTION_NAME);
        this.authenticationTracesCollection = this.collectionFactory.build(AUTHENTICATION_TRACES_COLLECTION_NAME);
        this.totpSecretCollection = this.collectionFactory.build(TOTP_SECRETS_COLLECTION_NAME);
        this.prefered2faMethodCollection = this.collectionFactory.build(PREFERED_2FA_METHOD_COLLECTION_NAME);
    }
    saveU2FRegistration(userId, appId, registration) {
        const newDocument = { userId, appId, registration };
        const filter = { userId, appId };
        return this.u2fSecretCollection.update(filter, newDocument, { upsert: true });
    }
    retrieveU2FRegistration(userId, appId) {
        const filter = { userId, appId };
        return this.u2fSecretCollection.findOne(filter);
    }
    saveAuthenticationTrace(userId, isAuthenticationSuccessful) {
        const newDocument = {
            userId, date: new Date(),
            isAuthenticationSuccessful: isAuthenticationSuccessful,
        };
        return this.authenticationTracesCollection.insert(newDocument);
    }
    retrieveLatestAuthenticationTraces(userId, count) {
        return this.authenticationTracesCollection.find({ userId }, { date: -1 }, count);
    }
    produceIdentityValidationToken(userId, token, challenge, maxAge) {
        const newDocument = {
            userId, token, challenge,
            maxDate: new Date(new Date().getTime() + maxAge)
        };
        return this.identityCheckTokensCollection.insert(newDocument);
    }
    consumeIdentityValidationToken(token, challenge) {
        const that = this;
        const filter = { token, challenge };
        let identityValidationDocument;
        return this.identityCheckTokensCollection.findOne(filter)
            .then(function (doc) {
            if (!doc) {
                return BluebirdPromise.reject(new Error("Registration token does not exist"));
            }
            identityValidationDocument = doc;
            const current_date = new Date();
            if (current_date > doc.maxDate)
                return BluebirdPromise.reject(new Error("Registration token is not valid anymore"));
            return that.identityCheckTokensCollection.remove(filter);
        })
            .then(() => {
            return BluebirdPromise.resolve(identityValidationDocument);
        });
    }
    saveTOTPSecret(userId, secret) {
        const doc = { userId, secret };
        return this.totpSecretCollection.update({ userId }, doc, { upsert: true });
    }
    retrieveTOTPSecret(userId) {
        return this.totpSecretCollection.findOne({ userId });
    }
    savePrefered2FAMethod(userId, method) {
        const newDoc = { userId, method };
        return this.prefered2faMethodCollection.update({ userId }, newDoc, { upsert: true });
    }
    retrievePrefered2FAMethod(userId) {
        return this.prefered2faMethodCollection.findOne({ userId })
            .then((doc) => {
            return (doc && doc.method) ? doc.method : undefined;
        });
    }
}
exports.UserDataStore = UserDataStore;
//# sourceMappingURL=UserDataStore.js.map