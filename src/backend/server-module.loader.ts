import {ConfigureServerModule} from '@dps/mycms-server-commons/dist/server-commons/configure-server.module';
import {TourDocServerModule} from './modules/tdoc-server.module';
import {PagesServerModule} from '@dps/mycms-server-commons/dist/pdoc-backend-commons/modules/pages-server.module';
import {FirewallConfig} from '@dps/mycms-server-commons/dist/server-commons/firewall.commons';
import {DnsBLModule} from '@dps/mycms-server-commons/dist/server-commons/dnsbl.module';
import {FirewallModule} from '@dps/mycms-server-commons/dist/server-commons/firewall.module';
import {StaticPagesDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/staticpages-data.service';
import {PagesDataserviceModule} from '@dps/mycms-server-commons/dist/pdoc-backend-commons/modules/pages-dataservice.module';
import {TourDocDataServiceModule} from './modules/tdoc-dataservice.module';
import {TourDocDataService} from './shared/tdoc-commons/services/tdoc-data.service';
import {AssetsServerModule} from './modules/assets-server.module';
import {DataCacheModule} from '@dps/mycms-server-commons/dist/server-commons/datacache.module';
import {TourDocWriterServerModule} from './modules/tdoc-writer-server.module';
import {VideoServerModule} from './modules/video-server.module';
import {TourDocPlaylistServerModule} from './modules/tdoc-playlist-server.module';
import {CommonServerConfigType} from '@dps/mycms-server-commons/dist/server-commons/server.commons';
import {BackendConfigType} from './modules/backend.commons';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';
import {PDocWriterServerModule} from '@dps/mycms-server-commons/dist/pdoc-backend-commons/modules/pdoc-writer-server.module';
import {PDocServerModule} from '@dps/mycms-server-commons/dist/pdoc-backend-commons/modules/pdoc-server.module';
import {PDocDataServiceModule} from '@dps/mycms-server-commons/dist/pdoc-backend-commons/modules/pdoc-dataservice.module';

export interface ServerConfig extends CommonServerConfigType<BackendConfigType, FirewallConfig> {
}

export class ServerModuleLoader {
    public static loadModules(app, serverConfig: ServerConfig) {
        const tdocWritable = serverConfig.backendConfig.tdocWritable === true || <any>serverConfig.backendConfig.tdocWritable === 'true';
        const pdocWritable = serverConfig.backendConfig.pdocWritable === true || <any>serverConfig.backendConfig.pdocWritable === 'true';
        const apiVideoServerEnabled = serverConfig.backendConfig.apiVideoServerEnabled === true
            || <any>serverConfig.backendConfig.apiVideoServerEnabled === 'true';

        ConfigureServerModule.configureServer(app, serverConfig.backendConfig);
        if (!tdocWritable) {
            ConfigureServerModule.configureServerAddHysteric(app, serverConfig.backendConfig);
        }
        FirewallModule.configureFirewall(app, serverConfig.firewallConfig, serverConfig.filePathErrorDocs);
        DnsBLModule.configureDnsBL(app, serverConfig.firewallConfig, serverConfig.filePathErrorDocs);

        // configure dataservices
        const tdocDataService: TourDocDataService = TourDocDataServiceModule.getDataService('tdocSolr',
            serverConfig.backendConfig);
        const pagesDataServiceDE: StaticPagesDataService = PagesDataserviceModule.getDataService('pdocSolrDE',
            serverConfig.backendConfig, 'de');
        const pagesDataServiceEN: StaticPagesDataService = PagesDataserviceModule.getDataService('pdocSolrEN',
            serverConfig.backendConfig, 'en');
        const cache: DataCacheModule = new DataCacheModule(serverConfig.backendConfig.cacheConfig);

        if (serverConfig.backendConfig.startPDocApi) {
            const pdocDataService: PDocDataService = PDocDataServiceModule.getDataService('pdocSolr',
                serverConfig.backendConfig);
            const pdocServerModule = PDocServerModule.configureRoutes(app, serverConfig.apiDataPrefix, pdocDataService, cache,
                serverConfig.backendConfig);
            if (pdocWritable) {
                PDocWriterServerModule.configureRoutes(app, serverConfig.apiDataPrefix, pdocServerModule);
            }
        }

        // add routes
        const tdocServerModule = TourDocServerModule.configureRoutes(app, serverConfig.apiDataPrefix, tdocDataService, cache,
            serverConfig.backendConfig);
        if (tdocWritable) {
            TourDocWriterServerModule.configureRoutes(app, serverConfig.apiDataPrefix, tdocServerModule);
        }

        PagesServerModule.configureRoutes(app, serverConfig.apiDataPrefix, pagesDataServiceDE, 'de');
        PagesServerModule.configureRoutes(app, serverConfig.apiDataPrefix, pagesDataServiceEN, 'en');

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
