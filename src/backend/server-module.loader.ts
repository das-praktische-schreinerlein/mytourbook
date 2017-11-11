import {ConfigureServerModule} from './modules/configure-server.module';
import {SDocServerModule} from './modules/sdoc-server.module';
import {PDocServerModule} from './modules/pdoc-server.module';
import {FirewallConfig} from './modules/firewall.commons';
import {DnsBLModule} from './modules/dnsbl.module';
import {FirewallModule} from './modules/firewall.module';
import {PDocDataService} from './shared/pdoc-commons/services/pdoc-data.service';
import {PDocDataServiceModule} from './modules/pdoc-dataservice.module';
import {SDocDataServiceModule} from './modules/sdoc-dataservice.module';
import {SDocDataService} from './shared/sdoc-commons/services/sdoc-data.service';
import {AssetsServerModule} from './modules/assets-server.module';
import {CacheConfig, DataCacheModule} from './modules/datacache.module';

export interface ServerConfig {
    apiDataPrefix: string;
    apiAssetsPrefix: string;
    apiPublicPrefix: string;
    filePathErrorDocs: string;
    backendConfig: {
        cacheConfig: CacheConfig;
    };
    firewallConfig: FirewallConfig;
    readOnly: boolean;
}

export class ServerModuleLoader {
    public static loadModules(app, serverConfig: ServerConfig) {
        ConfigureServerModule.configureServer(app, serverConfig.backendConfig);
        FirewallModule.configureFirewall(app, serverConfig.firewallConfig, serverConfig.filePathErrorDocs);
        DnsBLModule.configureDnsBL(app, serverConfig.firewallConfig, serverConfig.filePathErrorDocs);

        // configure dataservices
        const sdocDataService: SDocDataService = SDocDataServiceModule.getDataService('sdocSolr' + serverConfig.readOnly,
            serverConfig.backendConfig, serverConfig.readOnly);
        const pdocDataServiceDE: PDocDataService = PDocDataServiceModule.getDataService('pdocSolrDE' + serverConfig.readOnly,
            serverConfig.backendConfig, 'de', serverConfig.readOnly);
        const pdocDataServiceEN: PDocDataService = PDocDataServiceModule.getDataService('pdocSolrEN' + serverConfig.readOnly,
            serverConfig.backendConfig, 'en', serverConfig.readOnly);
        const cache: DataCacheModule = new DataCacheModule(serverConfig.backendConfig.cacheConfig);

        // add routes
        SDocServerModule.configureRoutes(app, serverConfig.apiDataPrefix, sdocDataService, cache, serverConfig.readOnly);
        PDocServerModule.configureRoutes(app, serverConfig.apiDataPrefix, pdocDataServiceDE, 'de', serverConfig.readOnly);
        PDocServerModule.configureRoutes(app, serverConfig.apiDataPrefix, pdocDataServiceEN, 'en', serverConfig.readOnly);
        AssetsServerModule.configureStaticTrackRoutes(app, serverConfig.apiAssetsPrefix, serverConfig.backendConfig);
        AssetsServerModule.configureStaticPictureRoutes(app, serverConfig.apiPublicPrefix, serverConfig.backendConfig);
        AssetsServerModule.configureStoredTrackRoutes(app, serverConfig.apiAssetsPrefix, serverConfig.backendConfig,
            serverConfig.firewallConfig.routerErrorsConfigs['tracks'].file, serverConfig.filePathErrorDocs);
        AssetsServerModule.configureStoredPictureRoutes(app, serverConfig.apiPublicPrefix, serverConfig.backendConfig,
            serverConfig.firewallConfig.routerErrorsConfigs['digifotos'].file, serverConfig.filePathErrorDocs);
    }
}
