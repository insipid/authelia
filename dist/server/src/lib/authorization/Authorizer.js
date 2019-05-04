"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MultipleDomainMatcher_1 = require("./MultipleDomainMatcher");
const Level_1 = require("./Level");
const IpRangeCheck = require("ip-range-check");
function MatchDomain(actualDomain) {
    return function (rule) {
        return MultipleDomainMatcher_1.MultipleDomainMatcher.match(actualDomain, rule.domain);
    };
}
function MatchResource(actualResource) {
    return function (rule) {
        if (!rule.resources)
            return true;
        for (let i = 0; i < rule.resources.length; ++i) {
            const regexp = new RegExp(rule.resources[i]);
            if (regexp.test(actualResource))
                return true;
        }
        return false;
    };
}
function MatchSubject(subject) {
    return (rule) => {
        if (!rule.subject)
            return true;
        if (rule.subject.startsWith("user:")) {
            const ruleUser = rule.subject.split(":")[1];
            if (subject.user == ruleUser)
                return true;
        }
        if (rule.subject.startsWith("group:")) {
            const ruleGroup = rule.subject.split(":")[1];
            if (subject.groups.indexOf(ruleGroup) > -1)
                return true;
        }
        return false;
    };
}
function MatchNetworks(ip) {
    return (rule) => {
        if (!rule.networks)
            return true;
        return rule.networks
            .map(net => IpRangeCheck(ip, net))
            .reduce((acc, v) => acc || v, false);
    };
}
class Authorizer {
    constructor(configuration, logger_) {
        this.configuration = configuration;
    }
    getMatchingRules(object, subject, ip) {
        const rules = this.configuration.rules;
        if (!rules)
            return [];
        return rules
            .filter(MatchDomain(object.domain))
            .filter(MatchResource(object.resource))
            .filter(MatchSubject(subject))
            .filter(MatchNetworks(ip));
    }
    ruleToLevel(policy) {
        if (policy == "bypass") {
            return Level_1.Level.BYPASS;
        }
        else if (policy == "one_factor") {
            return Level_1.Level.ONE_FACTOR;
        }
        else if (policy == "two_factor") {
            return Level_1.Level.TWO_FACTOR;
        }
        return Level_1.Level.DENY;
    }
    authorization(object, subject, ip) {
        if (!this.configuration)
            return Level_1.Level.BYPASS;
        const rules = this.getMatchingRules(object, subject, ip);
        return (rules.length > 0)
            ? this.ruleToLevel(rules[0].policy)
            : this.ruleToLevel(this.configuration.default_policy);
    }
}
exports.Authorizer = Authorizer;
//# sourceMappingURL=Authorizer.js.map