"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Configuration_1 = require("./schema/Configuration");
const Ajv = require("ajv");
const Path = require("path");
class ConfigurationParser {
    static parseTypes(configuration) {
        const schema = require(Path.resolve(__dirname, "./Configuration.schema.json"));
        const ajv = new Ajv({
            allErrors: true,
            missingRefs: "fail"
        });
        ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));
        const valid = ajv.validate(schema, configuration);
        if (!valid)
            return ajv.errors.map((e) => { return ajv.errorsText([e]); });
        return [];
    }
    static parse(configuration) {
        const validationErrors = this.parseTypes(configuration);
        if (validationErrors.length > 0) {
            validationErrors.forEach((e) => { console.log(e); });
            throw new Error("Malformed configuration (schema). Please double-check your configuration file.");
        }
        const [newConfiguration, completionErrors] = Configuration_1.complete(configuration);
        if (completionErrors.length > 0) {
            completionErrors.forEach((e) => { console.log(e); });
            throw new Error("Malformed configuration (validator). Please double-check your configuration file.");
        }
        return newConfiguration;
    }
}
exports.ConfigurationParser = ConfigurationParser;
//# sourceMappingURL=ConfigurationParser.js.map