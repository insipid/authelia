"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NedbCollection_1 = require("./NedbCollection");
const path = require("path");
class NedbCollectionFactory {
    constructor(options) {
        this.options = options;
    }
    build(collectionName) {
        const datastoreOptions = {
            inMemoryOnly: this.options.inMemoryOnly || false,
            autoload: true,
            filename: (this.options.filename) ? path.resolve(this.options.filename, collectionName) : undefined
        };
        return new NedbCollection_1.NedbCollection(datastoreOptions);
    }
}
exports.NedbCollectionFactory = NedbCollectionFactory;
//# sourceMappingURL=NedbCollectionFactory.js.map