import {Injectable} from '@angular/core';
import {Lightbox} from 'ngx-lightbox';
import {TourDocSearchResult} from '../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {TourDocContentUtils} from './tdoc-contentutils.service';
import {CommonDocLightBoxService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-lightbox.service';
import {TourDocRecord} from '../../../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocSearchForm} from '../../../shared/tdoc-commons/model/forms/tdoc-searchform';

@Injectable()
export class TourDocLightBoxService extends CommonDocLightBoxService<TourDocRecord, TourDocSearchForm, TourDocSearchResult> {
    constructor(protected contentUtils: TourDocContentUtils, protected lightbox: Lightbox) {
        super(contentUtils, lightbox);
    }
}
