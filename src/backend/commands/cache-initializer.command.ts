import {AbstractCommand} from './abstract.command';
import {ServerConfig} from '../server-module.loader';
import * as fs from 'fs';
import {SDocDataServiceModule} from '../modules/sdoc-dataservice.module';
import {DataCacheModule} from '../shared-node/server-commons/datacache.module';
import {SDocServerModule} from '../modules/sdoc-server.module';
import {SDocDataService} from '../shared/sdoc-commons/services/sdoc-data.service';

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

        const sdocDataService: SDocDataService =
            SDocDataServiceModule.getDataService('sdocSolr', serverConfig.backendConfig);
        const cache: DataCacheModule = new DataCacheModule(serverConfig.backendConfig.cacheConfig);
        const sdocServerModule = new SDocServerModule(sdocDataService, cache);

        return sdocServerModule.initCache();
    }
}
