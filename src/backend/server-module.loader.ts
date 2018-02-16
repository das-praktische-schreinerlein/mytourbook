import {ConfigureServerModule} from './shared-node/server-commons/configure-server.module';
import {SDocServerModule} from './modules/sdoc-server.module';
import {PDocServerModule} from './modules/pdoc-server.module';
import {FirewallConfig} from './shared-node/server-commons/firewall.commons';
import {DnsBLModule} from './shared-node/server-commons/dnsbl.module';
import {FirewallModule} from './shared-node/server-commons/firewall.module';
import {PDocDataService} from './shared/pdoc-commons/services/pdoc-data.service';
import {PDocDataServiceModule} from './modules/pdoc-dataservice.module';
import {SDocDataServiceModule} from './modules/sdoc-dataservice.module';
import {SDocDataService} from './shared/sdoc-commons/services/sdoc-data.service';
import {AssetsServerModule} from './modules/assets-server.module';
import {CacheConfig, DataCacheModule} from './shared-node/server-commons/datacache.module';
import {SDocWriterServerModule} from './modules/sdoc-writer-server.module';

export interface ServerConfig {
    apiDataPrefix: string;
    apiAssetsPrefix: string;
    apiPublicPrefix: string;
    filePathErrorDocs: string;
    backendConfig: {
        cacheConfig: CacheConfig;
    };
    firewallConfig: FirewallConfig;
}

export class ServerModuleLoader {
    public static loadModules(app, serverConfig: ServerConfig) {
        const writable = serverConfig.backendConfig['sdocWritable'] === true || serverConfig.backendConfig['sdocWritable'] === 'true';

        ConfigureServerModule.configureServer(app, serverConfig.backendConfig);
        if (!writable) {
            ConfigureServerModule.configureServerAddHysteric(app, serverConfig.backendConfig);
        }
        FirewallModule.configureFirewall(app, serverConfig.firewallConfig, serverConfig.filePathErrorDocs);
        DnsBLModule.configureDnsBL(app, serverConfig.firewallConfig, serverConfig.filePathErrorDocs);

        // configure dataservices
        const sdocDataService: SDocDataService = SDocDataServiceModule.getDataService('sdocSolr',
            serverConfig.backendConfig);
        const pdocDataServiceDE: PDocDataService = PDocDataServiceModule.getDataService('pdocSolrDE',
            serverConfig.backendConfig, 'de');
        const pdocDataServiceEN: PDocDataService = PDocDataServiceModule.getDataService('pdocSolrEN',
            serverConfig.backendConfig, 'en');
        const cache: DataCacheModule = new DataCacheModule(serverConfig.backendConfig.cacheConfig);

        // add routes
        const sdocServerModule = SDocServerModule.configureRoutes(app, serverConfig.apiDataPrefix, sdocDataService, cache);
        if (writable) {
            SDocWriterServerModule.configureRoutes(app, serverConfig.apiDataPrefix, sdocServerModule);
        }
        PDocServerModule.configureRoutes(app, serverConfig.apiDataPrefix, pdocDataServiceDE, 'de');
        PDocServerModule.configureRoutes(app, serverConfig.apiDataPrefix, pdocDataServiceEN, 'en');
        AssetsServerModule.configureStaticTrackRoutes(app, serverConfig.apiAssetsPrefix, serverConfig.backendConfig);
        AssetsServerModule.configureStaticPictureRoutes(app, serverConfig.apiPublicPrefix, serverConfig.backendConfig);
        AssetsServerModule.configureStoredTrackRoutes(app, serverConfig.apiAssetsPrefix, serverConfig.backendConfig,
            serverConfig.firewallConfig.routerErrorsConfigs['tracks'].file, serverConfig.filePathErrorDocs);
        AssetsServerModule.configureStoredPictureRoutes(app, serverConfig.apiPublicPrefix, serverConfig.backendConfig,
            serverConfig.firewallConfig.routerErrorsConfigs['digifotos'].file, serverConfig.filePathErrorDocs);
    }
}
