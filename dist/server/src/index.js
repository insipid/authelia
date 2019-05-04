#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Server_1 = require("./lib/Server");
const YAML = require("yamljs");
const configurationFilepath = process.argv[2];
if (!configurationFilepath) {
    console.log("No config file has been provided.");
    console.log("Usage: authelia <config>");
    process.exit(0);
}
const yamlContent = YAML.load(configurationFilepath);
const deps = {
    u2f: require("u2f"),
    ldapjs: require("ldapjs"),
    session: require("express-session"),
    winston: require("winston"),
    speakeasy: require("speakeasy"),
    nedb: require("nedb"),
    ConnectRedis: require("connect-redis"),
    Redis: require("redis")
};
const server = new Server_1.default(deps);
server.start(yamlContent, deps);
//# sourceMappingURL=index.js.map