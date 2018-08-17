import {Injectable} from '@angular/core';
import {Lightbox} from 'angular2-lightbox';
import {SDocSearchResult} from '../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {SDocContentUtils} from './sdoc-contentutils.service';
import {CommonDocLightBoxService} from '../../../shared/frontend-cdoc-commons/services/cdoc-lightbox.service';
import {SDocRecord} from '../../../shared/sdoc-commons/model/records/sdoc-record';
import {SDocSearchForm} from '../../../shared/sdoc-commons/model/forms/sdoc-searchform';

@Injectable()
export class SDocLightBoxService extends CommonDocLightBoxService<SDocRecord, SDocSearchForm, SDocSearchResult> {
    constructor(protected contentUtils: SDocContentUtils, protected lightbox: Lightbox) {
        super(contentUtils, lightbox);
    }
}
