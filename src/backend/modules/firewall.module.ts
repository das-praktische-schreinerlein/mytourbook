import {Router} from 'js-data-express';
import express from 'express';
import {FirewallCommons, FirewallConfig} from './firewall.commons';

const IpFilter = require('express-ipfilter').IpFilter;
const IpDeniedError = require('express-ipfilter').IpDeniedError;

export class FirewallModule {
    public static configureFirewall(app: express.Application, firewallConfig: FirewallConfig, filePathErrorDocs: string) {
        app.use(IpFilter(firewallConfig.blackListIps));
        app.use(function(err, req, res, _next) {
            console.error('FirewallModule: BLOCKED blacklisted IP:' + req['clientIp'] + ' URL:' + req.url);
            if (err instanceof IpDeniedError) {
                return FirewallCommons.resolveBlocked(req, res, firewallConfig, filePathErrorDocs);
            }

            res.status(err.status || 500);
            res.render('error', {
                message: 'You shall not pass'
            });
        });
    }
}
