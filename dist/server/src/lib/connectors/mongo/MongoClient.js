"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MongoDB = require("mongodb");
const Bluebird = require("bluebird");
class MongoClient {
    constructor(configuration, logger) {
        this.configuration = configuration;
        this.logger = logger;
    }
    connect() {
        const that = this;
        const options = {};
        if (that.configuration.auth) {
            options["auth"] = {
                user: that.configuration.auth.username,
                password: that.configuration.auth.password
            };
        }
        return new Bluebird((resolve, reject) => {
            MongoDB.MongoClient.connect(this.configuration.url, options, function (err, client) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(client);
            });
        })
            .then(function (client) {
            that.database = client.db(that.configuration.database);
            that.database.on("close", () => {
                that.logger.info("[MongoClient] Lost connection.");
            });
            that.database.on("reconnect", () => {
                that.logger.info("[MongoClient] Reconnected.");
            });
            that.client = client;
        });
    }
    close() {
        if (this.client) {
            this.client.close();
            this.database = undefined;
            this.client = undefined;
        }
        return Bluebird.resolve();
    }
    collection(name) {
        if (!this.client) {
            const that = this;
            return this.connect()
                .then(() => Bluebird.resolve(that.database.collection(name)));
        }
        return Bluebird.resolve(this.database.collection(name));
    }
}
exports.MongoClient = MongoClient;
//# sourceMappingURL=MongoClient.js.map