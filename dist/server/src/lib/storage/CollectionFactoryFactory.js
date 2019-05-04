"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NedbCollectionFactory_1 = require("./nedb/NedbCollectionFactory");
const MongoCollectionFactory_1 = require("./mongo/MongoCollectionFactory");
class CollectionFactoryFactory {
    static createNedb(options) {
        return new NedbCollectionFactory_1.NedbCollectionFactory(options);
    }
    static createMongo(client) {
        return new MongoCollectionFactory_1.MongoCollectionFactory(client);
    }
}
exports.CollectionFactoryFactory = CollectionFactoryFactory;
//# sourceMappingURL=CollectionFactoryFactory.js.map