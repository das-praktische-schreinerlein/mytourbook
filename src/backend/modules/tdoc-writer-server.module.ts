import {Router} from 'js-data-express';
import express from 'express';
import {TourDocRecord} from '../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocServerModule} from './tdoc-server.module';
import {TourDocDataService} from '../shared/tdoc-commons/services/tdoc-data.service';
import {CommonDocWriterServerModule} from '@dps/mycms-server-commons/dist/backend-commons/modules/cdoc-writer-server.module';
import {TourDocSearchForm} from '../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../shared/tdoc-commons/model/container/tdoc-searchresult';
import {TourDocAdapterResponseMapper} from '../shared/tdoc-commons/services/tdoc-adapter-response.mapper';

export class TourDocWriterServerModule extends CommonDocWriterServerModule<TourDocRecord, TourDocSearchForm, TourDocSearchResult, TourDocDataService> {
    public static configureRoutes(app: express.Application, apiPrefix: string, tdocServerModule: TourDocServerModule): TourDocWriterServerModule {
        const tdocWriterServerModule = new TourDocWriterServerModule(tdocServerModule);
        CommonDocWriterServerModule.configureServerRoutes(app, apiPrefix, tdocWriterServerModule);
        return tdocWriterServerModule;
    }

    public constructor(tdocServerModule: TourDocServerModule) {
        super(tdocServerModule, new TourDocAdapterResponseMapper({}));
    }
}
