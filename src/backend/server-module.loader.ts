import {ConfigureServerModule} from '@dps/mycms-server-commons/dist/server-commons/configure-server.module';
import {TourDocServerModule} from './modules/tdoc-server.module';
import {PDocServerModule} from './modules/pdoc-server.module';
import {FirewallConfig} from '@dps/mycms-server-commons/dist/server-commons/firewall.commons';
import {DnsBLModule} from '@dps/mycms-server-commons/dist/server-commons/dnsbl.module';
import {FirewallModule} from '@dps/mycms-server-commons/dist/server-commons/firewall.module';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';
import {PDocDataServiceModule} from './modules/pdoc-dataservice.module';
import {TourDocDataServiceModule} from './modules/tdoc-dataservice.module';
import {TourDocDataService} from './shared/tdoc-commons/services/tdoc-data.service';
import {AssetsServerModule} from './modules/assets-server.module';
import {DataCacheModule} from '@dps/mycms-server-commons/dist/server-commons/datacache.module';
import {TourDocWriterServerModule} from './modules/tdoc-writer-server.module';
import {VideoServerModule} from './modules/video-server.module';
import {TourDocPlaylistServerModule} from './modules/tdoc-playlist-server.module';
import {CommonServerConfigType} from '@dps/mycms-server-commons/dist/server-commons/server.commons';
import {BackendConfigType} from './modules/backend.commons';

export interface ServerConfig extends CommonServerConfigType<BackendConfigType, FirewallConfig> {
}

export class ServerModuleLoader {
    public static loadModules(app, serverConfig: ServerConfig) {
        const writable = serverConfig.backendConfig.tdocWritable === true || <any>serverConfig.backendConfig.tdocWritable === 'true';
        const apiVideoServerEnabled = serverConfig.backendConfig.apiVideoServerEnabled === true
            || <any>serverConfig.backendConfig.apiVideoServerEnabled === 'true';

        ConfigureServerModule.configureServer(app, serverConfig.backendConfig);
        if (!writable) {
            ConfigureServerModule.configureServerAddHysteric(app, serverConfig.backendConfig);
        }
        FirewallModule.configureFirewall(app, serverConfig.firewallConfig, serverConfig.filePathErrorDocs);
        DnsBLModule.configureDnsBL(app, serverConfig.firewallConfig, serverConfig.filePathErrorDocs);

        // configure dataservices
        const tdocDataService: TourDocDataService = TourDocDataServiceModule.getDataService('tdocSolr',
            serverConfig.backendConfig);
        const pdocDataServiceDE: PDocDataService = PDocDataServiceModule.getDataService('pdocSolrDE',
            serverConfig.backendConfig, 'de');
        const pdocDataServiceEN: PDocDataService = PDocDataServiceModule.getDataService('pdocSolrEN',
            serverConfig.backendConfig, 'en');
        const cache: DataCacheModule = new DataCacheModule(serverConfig.backendConfig.cacheConfig);

        // add routes
        const tdocServerModule = TourDocServerModule.configureRoutes(app, serverConfig.apiDataPrefix, tdocDataService, cache,
            serverConfig.backendConfig);
        if (writable) {
            TourDocWriterServerModule.configureRoutes(app, serverConfig.apiDataPrefix, tdocServerModule);
        }
        PDocServerModule.configureRoutes(app, serverConfig.apiDataPrefix, pdocDataServiceDE, 'de');
        PDocServerModule.configureRoutes(app, serverConfig.apiDataPrefix, pdocDataServiceEN, 'en');
        AssetsServerModule.configureStaticTrackRoutes(app, serverConfig.apiAssetsPrefix, serverConfig.backendConfig);
        AssetsServerModule.configureStaticPictureRoutes(app, serverConfig.apiPublicPrefix, serverConfig.backendConfig);
        AssetsServerModule.configureStoredTrackRoutes(app, serverConfig.apiAssetsPrefix, serverConfig.backendConfig,
            serverConfig.firewallConfig.routerErrorsConfigs['tracks'].file, serverConfig.filePathErrorDocs);
        AssetsServerModule.configureStoredPictureRoutes(app, serverConfig.apiPublicPrefix, serverConfig.backendConfig,
            serverConfig.firewallConfig.routerErrorsConfigs['digifotos'].file, serverConfig.filePathErrorDocs);

        if (apiVideoServerEnabled) {
            VideoServerModule.configureStaticVideoRoutes(app, serverConfig.apiPublicPrefix, serverConfig.backendConfig);
            VideoServerModule.configureStoredVideoRoutes(app, serverConfig.apiPublicPrefix, serverConfig.backendConfig,
                serverConfig.firewallConfig.routerErrorsConfigs['digifotos'].file, serverConfig.filePathErrorDocs);
        }
        TourDocPlaylistServerModule.configureRoutes(app, serverConfig.apiDataPrefix, tdocDataService, serverConfig.backendConfig);

        ConfigureServerModule.configureDefaultErrorHandler(app);
    }
}
