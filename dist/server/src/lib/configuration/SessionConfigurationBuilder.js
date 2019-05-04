"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SessionConfigurationBuilder {
    static build(configuration, deps) {
        const sessionOptions = {
            name: configuration.session.name,
            secret: configuration.session.secret,
            resave: false,
            saveUninitialized: true,
            cookie: {
                secure: true,
                httpOnly: true,
                maxAge: configuration.session.expiration,
                domain: configuration.session.domain
            },
        };
        if (configuration.session.redis) {
            const RedisStore = deps.ConnectRedis(deps.session);
            sessionOptions.store = new RedisStore({
                host: configuration.session.redis.host,
                port: configuration.session.redis.port,
                pass: configuration.session.redis.password,
                logErrors: true
            });
        }
        return sessionOptions;
    }
}
exports.SessionConfigurationBuilder = SessionConfigurationBuilder;
//# sourceMappingURL=SessionConfigurationBuilder.js.map