import {Injectable} from '@angular/core';
import {GenericAppService} from '../../../shared/commons/services/generic-app.service';
import {TourDocSearchForm} from '../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocRecord} from '../../../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocSearchResult} from '../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {TourDocDataService} from '../../../shared/tdoc-commons/services/tdoc-data.service';
import {CommonDocAlbumResolver} from '../../../shared/frontend-cdoc-commons/resolver/cdoc-album.resolver';
import {TourDocAlbumService} from '../services/tdoc-album.service';

@Injectable()
export class TourDocAlbumResolver extends CommonDocAlbumResolver<TourDocRecord, TourDocSearchForm, TourDocSearchResult,
    TourDocDataService> {
    constructor(appService: GenericAppService, albumService: TourDocAlbumService, dataService: TourDocDataService) {
        super(appService, albumService, dataService);
    }
}
