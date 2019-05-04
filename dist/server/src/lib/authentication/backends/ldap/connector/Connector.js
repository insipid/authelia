"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bluebird = require("bluebird");
const Exceptions = require("../../../../Exceptions");
class Connector {
    constructor(url, ldapjs) {
        const ldapClient = ldapjs.createClient({
            url: url,
            reconnect: true
        });
        this.client = Bluebird.promisifyAll(ldapClient);
    }
    bindAsync(username, password) {
        return this.client.bindAsync(username, password);
    }
    unbindAsync() {
        return this.client.unbindAsync();
    }
    searchAsync(base, query) {
        const that = this;
        return this.client.searchAsync(base, query)
            .then(function (res) {
            const doc = [];
            return new Bluebird((resolve, reject) => {
                res.on("searchEntry", function (entry) {
                    doc.push(entry.object);
                });
                res.on("error", function (err) {
                    reject(new Exceptions.LdapSearchError(err.message));
                });
                res.on("end", function () {
                    resolve(doc);
                });
            });
        })
            .catch(function (err) {
            return Bluebird.reject(new Exceptions.LdapSearchError(err.message));
        });
    }
    modifyAsync(dn, changeRequest) {
        return this.client.modifyAsync(dn, changeRequest);
    }
}
exports.Connector = Connector;
//# sourceMappingURL=Connector.js.map