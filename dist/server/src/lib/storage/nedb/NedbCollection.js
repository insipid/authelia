"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BluebirdPromise = require("bluebird");
const Nedb = require("nedb");
class NedbCollection {
    constructor(options) {
        this.collection = BluebirdPromise.promisifyAll(new Nedb(options));
    }
    find(query, sortKeys, count) {
        const q = this.collection.find(query).sort(sortKeys).limit(count);
        return BluebirdPromise.promisify(q.exec, { context: q })();
    }
    findOne(query) {
        return this.collection.findOneAsync(query);
    }
    update(query, updateQuery, options) {
        return this.collection.updateAsync(query, updateQuery, options);
    }
    remove(query) {
        return this.collection.removeAsync(query);
    }
    insert(document) {
        return this.collection.insertAsync(document);
    }
    count(query) {
        return this.collection.countAsync(query);
    }
}
exports.NedbCollection = NedbCollection;
//# sourceMappingURL=NedbCollection.js.map