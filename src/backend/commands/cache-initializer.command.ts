import {AbstractCommand} from '../shared-node/backend-commons/commands/abstract.command';
import {ServerConfig} from '../server-module.loader';
import * as fs from 'fs';
import {TourDocDataServiceModule} from '../modules/tdoc-dataservice.module';
import {DataCacheModule} from '../shared-node/server-commons/datacache.module';
import {TourDocServerModule} from '../modules/tdoc-server.module';
import {TourDocDataService} from '../shared/tdoc-commons/services/tdoc-data.service';

export class CacheInitializerCommand implements AbstractCommand {
    public process(argv): Promise<any> {
        const filePathConfigJson = argv['c'] || argv['backend'] || 'config/backend.json';
        const serverConfig: ServerConfig = {
            apiDataPrefix: '/api/v1',
            apiAssetsPrefix: '/api/assets',
            apiPublicPrefix: '/api/static',
            filePathErrorDocs: './error_docs/',
            backendConfig: JSON.parse(fs.readFileSync(filePathConfigJson, { encoding: 'utf8' })),
            firewallConfig: undefined
        };

        const tdocDataService: TourDocDataService =
            TourDocDataServiceModule.getDataService('tdocSolr', serverConfig.backendConfig);
        const cache: DataCacheModule = new DataCacheModule(serverConfig.backendConfig.cacheConfig);
        const tdocServerModule = new TourDocServerModule(tdocDataService, cache);

        return tdocServerModule.initCache();
    }
}
