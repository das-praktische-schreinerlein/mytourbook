import {TourDocSearchResult} from '../shared/tdoc-commons/model/container/tdoc-searchresult';
import {TourDocSearchForm, TourDocSearchFormValidator} from '../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocDataService} from '../shared/tdoc-commons/services/tdoc-data.service';
import {Router} from 'js-data-express';
import express from 'express';
import {TourDocRecord} from '../shared/tdoc-commons/model/records/tdoc-record';
import {DataCacheModule} from '../shared-node/server-commons/datacache.module';
import {CommonDocServerModule} from '../shared-node/backend-commons/modules/cdoc-server.module';
import {CommonDocSearchForm} from '../shared/search-commons/model/forms/cdoc-searchform';

export class TourDocServerModule extends CommonDocServerModule<TourDocRecord, TourDocSearchForm, TourDocSearchResult, TourDocDataService> {
    public static configureRoutes(app: express.Application, apiPrefix: string, dataService: TourDocDataService,
                                  cache: DataCacheModule, backendConfig: {}): TourDocServerModule {
        const tdocServerModule = new TourDocServerModule(dataService, cache);
        CommonDocServerModule.configureServerRoutes(app, apiPrefix, tdocServerModule, cache, backendConfig);
        return tdocServerModule;
    }

    public constructor(protected dataService: TourDocDataService, protected cache: DataCacheModule) {
        super(dataService, cache);
    }

    getApiId(): string {
        return 'tdoc';
    }

    getApiResolveParameterName(): string {
        return 'resolveTdocByTdocId';
    }

    isSearchFormValid(searchForm: CommonDocSearchForm): boolean {
        return TourDocSearchFormValidator.isValid(<TourDocSearchForm>searchForm);
    }

}
