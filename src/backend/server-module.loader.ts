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
import {DefaultOptions} from '@dps/mycms-commons/dist/markdown-commons/options';
import {MarkdownDefaultExtensions} from '@dps/mycms-commons/dist/markdown-commons/extensions/markdown.extensions';
import {MarkdownService} from '@dps/mycms-commons/dist/markdown-commons/markdown.service';

export interface ServerConfig extends CommonServerConfigType<BackendConfigType, FirewallConfig> {
}

export class ServerModuleLoader {
    public static loadModules(app, serverConfig: ServerConfig) {
        const cache: DataCacheModule = new DataCacheModule(serverConfig.backendConfig.cacheConfig);

        ServerModuleLoader.configureDefaultServer(app, serverConfig, cache);
        ServerModuleLoader.loadModulePages(app, serverConfig, cache);
        ServerModuleLoader.loadAdditionalModules(app, serverConfig, cache);
    }

    public static configureDefaultServer(app, serverConfig: ServerConfig, cache: DataCacheModule) {
        ConfigureServerModule.configureServer(app, serverConfig.backendConfig);

        if (!ServerModuleLoader.isServerWritable(serverConfig)) {
            ConfigureServerModule.configureServerAddHysteric(app, serverConfig.backendConfig);
        }

        FirewallModule.configureFirewall(app, serverConfig.firewallConfig, serverConfig.filePathErrorDocs);
        DnsBLModule.configureDnsBL(app, serverConfig.firewallConfig, serverConfig.filePathErrorDocs);

        ConfigureServerModule.configureDefaultErrorHandler(app);
    }

    public static loadAdditionalModules(app, serverConfig: ServerConfig, cache: DataCacheModule) {
        ServerModuleLoader.loadModuleTDoc(app, serverConfig, cache);
        ServerModuleLoader.loadModulePDoc(app, serverConfig, cache);
    }

    public static loadModulePages(app, serverConfig: ServerConfig, cache: DataCacheModule) {
        const markdownService = new MarkdownService(DefaultOptions.getDefault(), MarkdownDefaultExtensions);
        const pagesDataServiceDE: StaticPagesDataService = PagesDataserviceModule.getDataService('pdocSolrDE',
            serverConfig.backendConfig, 'de', markdownService);
        const pagesDataServiceEN: StaticPagesDataService = PagesDataserviceModule.getDataService('pdocSolrEN',
            serverConfig.backendConfig, 'en', markdownService);

        PagesServerModule.configureRoutes(app, serverConfig.apiDataPrefix, pagesDataServiceDE, 'de', serverConfig.backendConfig.profile);
        PagesServerModule.configureRoutes(app, serverConfig.apiDataPrefix, pagesDataServiceEN, 'en', serverConfig.backendConfig.profile);
    }

    public static loadModulePDoc(app, serverConfig: ServerConfig, cache: DataCacheModule) {
        if (serverConfig.backendConfig.startPDocApi) {
            const pdocDataService: PDocDataService = PDocDataServiceModule.getDataService('pdocSolr',
                serverConfig.backendConfig);
            const pdocServerModule = PDocServerModule.configureRoutes(app, serverConfig.apiDataPrefix,
                pdocDataService, cache, serverConfig.backendConfig);

            const pdocWritable = serverConfig.backendConfig.pdocWritable === true
                || <any>serverConfig.backendConfig.pdocWritable === 'true';
            if (pdocWritable) {
                PDocWriterServerModule.configureRoutes(app, serverConfig.apiDataPrefix, pdocServerModule);
            }
        }
    }

    public static isServerWritable(serverConfig: ServerConfig) {
        const pdocWritable = serverConfig.backendConfig.pdocWritable === true
            || <any>serverConfig.backendConfig.pdocWritable === 'true';
        const tdocWritable = serverConfig.backendConfig.tdocWritable === true
            || <any>serverConfig.backendConfig.tdocWritable === 'true';

        return pdocWritable || tdocWritable;
    }

    public static loadModuleTDoc(app, serverConfig: ServerConfig, cache: DataCacheModule) {
        const tdocWritable = serverConfig.backendConfig.tdocWritable === true
            || <any>serverConfig.backendConfig.tdocWritable === 'true';
        const apiVideoServerEnabled = serverConfig.backendConfig.apiVideoServerEnabled === true
            || <any>serverConfig.backendConfig.apiVideoServerEnabled === 'true';

        // configure dataservices
        const tdocDataService: TourDocDataService = TourDocDataServiceModule.getDataService('tdocSolr',
            serverConfig.backendConfig);

        // add routes
        const tdocServerModule = TourDocServerModule.configureRoutes(app, serverConfig.apiDataPrefix,
            tdocDataService, cache, serverConfig.backendConfig);
        if (tdocWritable) {
            TourDocWriterServerModule.configureRoutes(app, serverConfig.apiDataPrefix, tdocServerModule);
        }

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
    }

}
