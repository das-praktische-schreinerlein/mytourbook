import {AbstractCommand} from './abstract.command';
import {ServerConfig} from '../server-module.loader';
import * as fs from 'fs';
import {SDocDataService} from '../shared/sdoc-commons/services/sdoc-data.service';
import {SDocDataServiceModule} from '../modules/sdoc-dataservice.module';
import {DataCacheModule} from '../shared-node/server-commons/datacache.module';
import {SDocServerModule} from '../modules/sdoc-server.module';
import {SDocSearchForm} from '../shared/sdoc-commons/model/forms/sdoc-searchform';
import {GenericSearchResult} from '../shared/search-commons/model/container/generic-searchresult';
import {BaseEntityRecord} from '../shared/search-commons/model/records/base-entity-record';
import {GenericSearchForm} from '../shared/search-commons/model/forms/generic-searchform';
import {utils} from 'js-data';

export class CacheInitializerCommand implements AbstractCommand {
    public process(argv): Promise<any> {
        const filePathConfigJson = argv['c'] || argv['backend'] || 'config/backend.json';
        const serverConfig: ServerConfig = {
            apiDataPrefix: '/api/v1',
            apiAssetsPrefix: '/api/assets',
            apiPublicPrefix: '/api/static',
            filePathErrorDocs: './error_docs/',
            backendConfig: JSON.parse(fs.readFileSync(filePathConfigJson, { encoding: 'utf8' })),
            firewallConfig: undefined,
            readOnly: true
        };

        const sdocDataService: SDocDataService = SDocDataServiceModule.getDataService('sdocSolr' + serverConfig.readOnly,
            serverConfig.backendConfig, serverConfig.readOnly);
        const cache: DataCacheModule = new DataCacheModule(serverConfig.backendConfig.cacheConfig);
        const sdocServerModule = new SDocServerModule(sdocDataService, cache);
        const searchForm = new SDocSearchForm({});

        const getById = function(id) {
            return sdocServerModule.getById({}, function () {}, id);
        };

        const createNextCache = function(): Promise<any> {
            console.log('DO - search for page: ' + searchForm.pageNum);
            return sdocDataService.search(searchForm).then(
                function searchDone(searchResult: GenericSearchResult<BaseEntityRecord, GenericSearchForm>) {
                    const ids = [];
                    for (const doc of searchResult.currentRecords) {
                        ids.push(doc.id);
                    }

                    console.log('DO - initcache for page: ' + searchForm.pageNum + ' sdocs:', ids);

                    const actions = ids.map(getById); // run the function over all items

                    // we now have a promises array and we want to wait for it
                    const results = Promise.all(actions); // pass array of promises

                    return results.then(data => {
                        console.log('DONE - initcache for page: ' + searchForm.pageNum + ' sdocs:', ids);
                        searchForm.pageNum++;
                        if (searchForm.pageNum < searchResult.recordCount / searchForm.perPage) {
                            return createNextCache();
                        } else {
                            console.log('DONE - initializing cache');
                            return utils.resolve('WELL DONE');
                        }
                    });
                }).catch(function searchError(error) {
                    console.error('error thrown: ', error);
                    return utils.reject(error);
                });
        };

        return createNextCache();
    }
}
