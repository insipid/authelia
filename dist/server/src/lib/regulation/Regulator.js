"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BluebirdPromise = require("bluebird");
const exceptions = require("../Exceptions");
class Regulator {
    constructor(userDataStore, maxRetries, findTime, banTime) {
        this.userDataStore = userDataStore;
        this.banTime = banTime;
        this.findTime = findTime;
        this.maxRetries = maxRetries;
    }
    mark(userId, isAuthenticationSuccessful) {
        return this.userDataStore.saveAuthenticationTrace(userId, isAuthenticationSuccessful);
    }
    regulate(userId) {
        const that = this;
        if (that.maxRetries <= 0)
            return BluebirdPromise.resolve();
        return this.userDataStore.retrieveLatestAuthenticationTraces(userId, that.maxRetries)
            .then((docs) => {
            if (docs.length < that.maxRetries)
                return BluebirdPromise.resolve();
            const numberOfFailedAuth = docs
                .map(function (d) { return d.isAuthenticationSuccessful == false ? 1 : 0; })
                .reduce(function (acc, v) { return acc + v; }, 0);
            if (numberOfFailedAuth < this.maxRetries)
                return BluebirdPromise.resolve();
            const newestDocument = docs[0];
            const oldestDocument = docs[that.maxRetries - 1];
            const authenticationsTimeRangeInSeconds = (newestDocument.date.getTime() - oldestDocument.date.getTime()) / 1000;
            const tooManyAuthInTimelapse = (authenticationsTimeRangeInSeconds < this.findTime);
            const stillInBannedTimeRange = (new Date(new Date().getTime() - this.banTime * 1000) < newestDocument.date);
            if (tooManyAuthInTimelapse && stillInBannedTimeRange)
                throw new exceptions.AuthenticationRegulationError("Max number of authentication. Please retry in few minutes.");
            return BluebirdPromise.resolve();
        });
    }
}
exports.Regulator = Regulator;
//# sourceMappingURL=Regulator.js.map