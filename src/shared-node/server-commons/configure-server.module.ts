import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import {json, urlencoded} from 'body-parser';
import protect from '@risingstack/protect';
import requestIp from 'request-ip';

export class ConfigureServerModule {
    public static configureServer(app: express.Application, backendConfig: {}) {
        // configure parsing
        app.use(json()); // for parsing application/json
        app.use(urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

        // secure server
        const mycors = cors({
            origin: backendConfig['corsOrigin'],
            optionsSuccessStatus: 200,
            credentials: true
        });
        app.use(mycors);
        app.use(helmet());
        app.use(protect.express.sqlInjection({
            body: true,
            loggerFunction: console.error
        }));
        app.use(protect.express.xss({
            body: true,
            loggerFunction: console.error
        }));

        // configure response
        app.use(compression());

        // require request-ip and register it as middleware
        app.use(requestIp.mw());
    }
}
