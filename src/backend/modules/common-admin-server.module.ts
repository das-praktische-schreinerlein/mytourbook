import express from 'express';
import {CommonServerAdminCommandConfigType, CommonServerAdminCommandManager} from '../commands/common-serveradmin-command.manager';
import {FirewallConfig} from '@dps/mycms-server-commons/dist/server-commons/firewall.commons';

export interface CommonAdminBackendConfigType<A extends CommonServerAdminCommandConfigType> {
    commandConfig: A;
    port: number;
    corsOrigin: boolean;
    bindIp: string;
    tcpBacklog: number;
}

export interface CommonAdminServerConfigType<A extends CommonAdminBackendConfigType<C>,
    C extends CommonServerAdminCommandConfigType, F extends FirewallConfig> {
    apiAdminPrefix: string;
    adminBackendConfig: A;
    filePathErrorDocs: string;
    firewallConfig: F;
}

export class AdminServerModule {
    public static configureRoutes(app: express.Application, apiPrefix: string,
                                  adminCommandManager: CommonServerAdminCommandManager<CommonServerAdminCommandConfigType>) {
        console.log('configure route ', apiPrefix + '/:locale');
        app.route(apiPrefix + '/:locale' + '/' + 'listPreparedCommands')
            .all(function(req, res, next) {
                if (req.method !== 'POST') {
                    return next('not allowed');
                }
                return next();
            })
            .post(function(req, res, next) {
                const value = adminCommandManager.listPreparedCommands();
                res.json({'resultmsg': 'DONE', 'preparedCommands': value});
                return next();
            });
        app.route(apiPrefix + '/:locale' + '/' + 'listAvailableCommands')
            .all(function(req, res, next) {
                if (req.method !== 'POST') {
                    return next('not allowed');
                }
                return next();
            })
            .post(function(req, res, next) {
                const value = adminCommandManager.listAvailableCommands();
                res.json({'resultmsg': 'DONE', 'commands': value});
                return next();
            });
        app.route(apiPrefix + '/:locale' + '/' + 'execCommand')
            .all(function(req, res, next) {
                if (req.method !== 'POST') {
                    return next('not allowed');
                }
                return next();
            })
            .post(function(req, res, next) {
                const commandSrc = req['body'];
                if (commandSrc === undefined) {
                    console.log('adminequest failed: no requestbody');
                    res.status(403);
                    res.json();
                    return next('not found');
                }

                const argv = typeof commandSrc === 'string'
                    ? JSON.parse(commandSrc).execommand
                    : commandSrc;
                // TODO: create multiresponse with showing ... till end
                adminCommandManager.process(argv).then(value => {
                    console.log('DONE - adminequest finished:', value, argv);
                    res.json({'resultmsg': 'DONE'});
                    return next();
                }).catch(reason => {
                    console.error('ERROR - adminequest failed:', reason, argv);
                    res.status(403);
                    res.json({'resultmsg': 'adminequest failed'});
                    return next('not found');
                });
            });
    }

}
