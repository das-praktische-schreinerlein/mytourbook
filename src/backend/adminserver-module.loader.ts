import {ConfigureServerModule} from '@dps/mycms-server-commons/dist/server-commons/configure-server.module';
import {FirewallConfig} from '@dps/mycms-server-commons/dist/server-commons/firewall.commons';
import {DnsBLModule} from '@dps/mycms-server-commons/dist/server-commons/dnsbl.module';
import {FirewallModule} from '@dps/mycms-server-commons/dist/server-commons/firewall.module';
import {
    AdminServerModule,
    CommonAdminBackendConfigType
} from '@dps/mycms-server-commons/dist/backend-commons/modules/common-admin-server.module';
import {ServerAdminCommandConfigType, ServerAdminCommandManager} from './commands/serveradmin-command.manager';
import {CommonServerAdminCommandConfigType} from '@dps/mycms-server-commons/dist/backend-commons/commands/common-serveradmin-command.manager';

export interface CommonAdminServerConfigType<A extends CommonAdminBackendConfigType<C>,
    C extends CommonServerAdminCommandConfigType, F extends FirewallConfig> {
    apiAdminPrefix: string;
    adminBackendConfig: A;
    filePathErrorDocs: string;
    firewallConfig: F;
}

export interface AdminConfigType extends CommonAdminBackendConfigType<ServerAdminCommandConfigType> {
}

export interface AdminServerConfig extends CommonAdminServerConfigType<AdminConfigType,
    ServerAdminCommandConfigType, FirewallConfig> {
}

export class AdminServerModuleLoader {
    public static loadAdminModules(app, serverConfig: AdminServerConfig) {
        const adminWritable = serverConfig.adminBackendConfig.commandConfig.adminWritable === true
            || <any>serverConfig.adminBackendConfig.commandConfig.adminWritable === 'true';
        ConfigureServerModule.configureServer(app, serverConfig.adminBackendConfig);
        if (!adminWritable) {
            ConfigureServerModule.configureServerAddHysteric(app, serverConfig.adminBackendConfig);
        }
        FirewallModule.configureFirewall(app, serverConfig.firewallConfig, serverConfig.filePathErrorDocs);
        DnsBLModule.configureDnsBL(app, serverConfig.firewallConfig, serverConfig.filePathErrorDocs);

        // add routes
        const serverAdminCommandManager = new ServerAdminCommandManager(serverConfig.adminBackendConfig.commandConfig);
        AdminServerModule.configureRoutes(app, serverConfig.apiAdminPrefix, serverAdminCommandManager);

        ConfigureServerModule.configureDefaultErrorHandler(app);
    }
}
