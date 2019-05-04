"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MongoCollection {
    constructor(collectionName, mongoClient) {
        this.collectionName = collectionName;
        this.mongoClient = mongoClient;
    }
    collection() {
        return this.mongoClient.collection(this.collectionName);
    }
    find(query, sortKeys, count) {
        return this.collection()
            .then((collection) => collection.find(query).sort(sortKeys).limit(count))
            .then((query) => query.toArray());
    }
    findOne(query) {
        return this.collection()
            .then((collection) => collection.findOne(query));
    }
    update(query, updateQuery, options) {
        return this.collection()
            .then((collection) => collection.update(query, updateQuery, options));
    }
    remove(query) {
        return this.collection()
            .then((collection) => collection.remove(query));
    }
    insert(document) {
        return this.collection()
            .then((collection) => collection.insertOne(document));
    }
    count(query) {
        return this.collection()
            .then((collection) => collection.count(query));
    }
}
exports.MongoCollection = MongoCollection;
//# sourceMappingURL=MongoCollection.js.map