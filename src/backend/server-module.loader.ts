import {ConfigureServerModule} from './modules/configure-server.module';
import {SDocServerModule} from './modules/sdoc-server.module';
import {PDocServerModule} from './modules/pdoc-server.module';
import {ProxyServerModule} from './modules/proxy-server.module';
import {FirewallConfig} from './modules/firewall.commons';
import {DnsBLModule} from './modules/dnsbl.module';
import {FirewallModule} from './modules/firewall.module';

export interface ServerConfig {
    apiPrefix: string;
    filePathErrorDocs: string;
    backendConfig: {};
    firewallConfig: FirewallConfig;
}

export class ServerModuleLoader {
    public static loadModules(app, serverConfig: ServerConfig) {
        ConfigureServerModule.configureServer(app, serverConfig.backendConfig);
        FirewallModule.configureFirewall(app, serverConfig.firewallConfig, serverConfig.filePathErrorDocs);
        DnsBLModule.configureDnsBL(app, serverConfig.firewallConfig, serverConfig.filePathErrorDocs);

        // add routes
        SDocServerModule.configureRoutes(app, serverConfig.apiPrefix, serverConfig.backendConfig);
        PDocServerModule.configureRoutes(app, serverConfig.apiPrefix, serverConfig.backendConfig, 'de');
        PDocServerModule.configureRoutes(app, serverConfig.apiPrefix, serverConfig.backendConfig, 'en');
        ProxyServerModule.configureRoutes(app, '', serverConfig.backendConfig);
    }
}
