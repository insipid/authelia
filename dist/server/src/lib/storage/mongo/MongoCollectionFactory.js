"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MongoCollection_1 = require("./MongoCollection");
class MongoCollectionFactory {
    constructor(mongoClient) {
        this.mongoClient = mongoClient;
    }
    build(collectionName) {
        return new MongoCollection_1.MongoCollection(collectionName, this.mongoClient);
    }
}
exports.MongoCollectionFactory = MongoCollectionFactory;
//# sourceMappingURL=MongoCollectionFactory.js.map