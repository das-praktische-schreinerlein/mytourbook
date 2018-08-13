import {Injectable} from '@angular/core';
import {GenericAppService} from '../../../shared/commons/services/generic-app.service';
import {SDocSearchForm} from '../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocRecord} from '../../../shared/sdoc-commons/model/records/sdoc-record';
import {SDocSearchResult} from '../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {SDocDataService} from '../../../shared/sdoc-commons/services/sdoc-data.service';
import {AbstractCommonDocAlbumResolver} from '../../../shared/frontend-cdoc-commons/resolver/abstract-cdoc-album.resolver';
import {SDocAlbumService} from '../services/sdoc-album.service';

@Injectable()
export class SDocAlbumResolver extends AbstractCommonDocAlbumResolver<SDocRecord, SDocSearchForm, SDocSearchResult,
    SDocDataService> {
    constructor(appService: GenericAppService, albumService: SDocAlbumService, dataService: SDocDataService) {
        super(appService, albumService, dataService);
    }
}
