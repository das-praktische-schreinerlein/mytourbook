import express from 'express';
import {json, urlencoded} from 'body-parser';
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const protect = require('@risingstack/protect');
const requestIp = require('request-ip');

export class ConfigureServerModule {
    public static configureServer(app: express.Application, backendConfig: {}) {
        // configure parsing
        app.use(json({limit: '1mb'})); // for parsing application/json
        app.use(urlencoded({ extended: true, limit: '1mb' })); // for parsing application/x-www-form-urlencoded
        // secure server
        const mycors = cors({
            origin: backendConfig['corsOrigin'],
            optionsSuccessStatus: 200,
            credentials: true
        });
        app.use(mycors);
        app.use(helmet());
        /**
        app.use(protect.express.sqlInjection({
            body: true,
            loggerFunction: console.warn
        }));
        app.use(protect.express.xss({
            body: true,
            loggerFunction: console.warn
        }));
         */

        // configure response
        app.use(compression());

        // require request-ip and register it as middleware
        app.use(requestIp.mw());
    }
}
