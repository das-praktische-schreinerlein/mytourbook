import {SDocSearchResult} from '../shared/sdoc-commons/model/container/sdoc-searchresult';
import {SDocSearchForm, SDocSearchFormValidator} from '../shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocDataService} from '../shared/sdoc-commons/services/sdoc-data.service';
import {Router} from 'js-data-express';
import express from 'express';
import {SDocRecord} from '../shared/sdoc-commons/model/records/sdoc-record';
import {DataCacheModule} from '../shared-node/server-commons/datacache.module';
import {CommonDocServerModule} from '../shared-node/backend-commons/modules/cdoc-server.module';
import {CommonDocSearchForm} from '../shared/search-commons/model/forms/cdoc-searchform';

export class SDocServerModule extends CommonDocServerModule<SDocRecord, SDocSearchForm, SDocSearchResult, SDocDataService> {
    public static configureRoutes(app: express.Application, apiPrefix: string, dataService: SDocDataService,
                                  cache: DataCacheModule, backendConfig: {}): SDocServerModule {
        const sdocServerModule = new SDocServerModule(dataService, cache);
        CommonDocServerModule.configureServerRoutes(app, apiPrefix, sdocServerModule, cache, backendConfig);
        return sdocServerModule;
    }

    public constructor(protected dataService: SDocDataService, protected cache: DataCacheModule) {
        super(dataService, cache);
    }

    getApiId(): string {
        return 'sdoc';
    }

    getApiResolveParameterName(): string {
        return 'resolveSdocBySdocId';
    }

    isSearchFormValid(searchForm: CommonDocSearchForm): boolean {
        return SDocSearchFormValidator.isValid(<SDocSearchForm>searchForm);
    }

}
