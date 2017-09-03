import {Router} from 'js-data-express';
import express from 'express';

const IpFilter = require('express-ipfilter').IpFilter;
const IpDeniedError = require('express-ipfilter').IpDeniedError;

export interface FirewallConfig {
    routerErrorsConfigs: {
        pattern: string,
        file: string
    };
    blackListIps: {};
}

export class FirewallModule {
    public static configureFirewall(app: express.Application, firewallConfig: FirewallConfig, filePathErrorDocs: string) {
        app.use(IpFilter(firewallConfig.blackListIps));
        app.use(function(err, req, res, _next) {
            if (err instanceof IpDeniedError) {
                for (const key in firewallConfig.routerErrorsConfigs) {
                    const errorConfig = firewallConfig.routerErrorsConfigs[key];
                    if (req.url.toString().match(errorConfig.pattern)) {
                        res.status(200);
                        res.sendFile(errorConfig.file, {root: filePathErrorDocs});

                        return;
                    }
                }

                res.status(401);
            } else {
                res.status(err.status || 500);
            }

            res.render('error', {
                message: 'You shall not pass',
                error: err
            });
        });
    }
}
