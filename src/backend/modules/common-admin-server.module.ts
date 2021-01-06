import express from 'express';
import {CommonServerAdminCommandConfigType, CommonServerAdminCommandManager} from '../commands/common-serveradmin-command.manager';
import {FirewallConfig} from '@dps/mycms-server-commons/dist/server-commons/firewall.commons';
import {CommonAdminParameterConfigType} from '../commands/common-admin-command.manager';

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
                                  adminCommandManager: CommonServerAdminCommandManager<CommonServerAdminCommandConfigType,
                                      CommonAdminParameterConfigType>) {
        console.log('configure route ', apiPrefix + '/:locale');
        app.route(apiPrefix + '/:locale' + '/' + 'execcommand')
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
