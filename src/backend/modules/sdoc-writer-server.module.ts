import {Router} from 'js-data-express';
import express from 'express';
import {SDocRecord} from '../shared/sdoc-commons/model/records/sdoc-record';
import {SDocServerModule} from './sdoc-server.module';
import {SDocDataService} from '../shared/sdoc-commons/services/sdoc-data.service';
import {CommonDocWriterServerModule} from '../shared/backend-commons/modules/cdoc-writer-server.module';
import {SDocSearchForm} from '../shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocSearchResult} from '../shared/sdoc-commons/model/container/sdoc-searchresult';
import {SDocAdapterResponseMapper} from '../shared/sdoc-commons/services/sdoc-adapter-response.mapper';

export class SDocWriterServerModule extends CommonDocWriterServerModule<SDocRecord, SDocSearchForm, SDocSearchResult, SDocDataService> {
    public static configureRoutes(app: express.Application, apiPrefix: string, sdocServerModule: SDocServerModule): SDocWriterServerModule {
        const sdocWriterServerModule = new SDocWriterServerModule(sdocServerModule);
        CommonDocWriterServerModule.configureServerRoutes(app, apiPrefix, sdocWriterServerModule);
        return sdocWriterServerModule;
    }

    public constructor(sdocServerModule: SDocServerModule) {
        super(sdocServerModule, new SDocAdapterResponseMapper({}));
    }
}
