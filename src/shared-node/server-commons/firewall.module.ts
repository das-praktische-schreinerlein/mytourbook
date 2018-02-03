import {Router} from 'js-data-express';
import express from 'express';
import {FirewallCommons, FirewallConfig} from './firewall.commons';
import {ServerLogUtils} from './serverlog.utils';

const IpFilter = require('express-ipfilter').IpFilter;
const IpDeniedError = require('express-ipfilter').IpDeniedError;

export class FirewallModule {
    public static configureFirewall(app: express.Application, firewallConfig: FirewallConfig, filePathErrorDocs: string) {
        app.use(IpFilter(firewallConfig.blackListIps));
        app.use(function(err, req, res, _next) {
            console.warn('FirewallModule: BLOCKED blacklisted IP:' + ServerLogUtils.sanitizeLogMsg(req['clientIp']) +
                ' URL:' + ServerLogUtils.sanitizeLogMsg(req.url));
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
