import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {
    CommonDocActionTagService,
    CommonDocActionTagServiceConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-actiontag.service';
import {TourDocDataService} from '../../../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocRecord} from '../../../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocSearchForm} from '../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {TourDocAlbumService} from './tdoc-album.service';

@Injectable()
export class TourDocActionTagService extends CommonDocActionTagService<TourDocRecord, TourDocSearchForm, TourDocSearchResult,
    TourDocDataService> {
    constructor(protected router: Router, protected cdocDataService: TourDocDataService,
                protected cdocAlbumService: TourDocAlbumService,
                protected appService: GenericAppService) {
        super(router, cdocDataService, cdocAlbumService, appService);
        this.configureComponent({});
    }

    protected getComponentConfig(config: {}): CommonDocActionTagServiceConfig {
        return {
            baseEditPath: 'tdocadmin'
        };
    }
}
