import {Injectable} from '@angular/core';
import {SearchFormUtils} from '../../../shared/angular-commons/services/searchform-utils.service';
import {SearchParameterUtils} from '../../../shared/search-commons/services/searchparameter.utils';
import {CommonDocSearchResult} from '../../../shared/search-commons/model/container/cdoc-searchresult';
import {CommonDocRecord} from '../../../shared/search-commons/model/records/cdoc-entity-record';
import {CommonDocSearchForm} from '../../../../shared/search-commons/model/forms/cdoc-searchform';

@Injectable()
export class CommonDocSearchFormUtils {

    constructor(protected searchFormUtils: SearchFormUtils, protected searchParameterUtils: SearchParameterUtils) {
    }

    getWhenValues(searchResult: CommonDocSearchResult<CommonDocRecord, CommonDocSearchForm>): any[] {
        return [].concat(
            this.searchFormUtils.getFacetValues(searchResult, 'year_is', 'year', ''),
            this.searchFormUtils.getFacetValues(searchResult, 'month_is', 'month', 'Monat'),
            this.searchFormUtils.getFacetValues(searchResult, 'week_is', 'week', 'Woche'));
    }

    getWhatValues(searchResult: CommonDocSearchResult<CommonDocRecord, CommonDocSearchForm>): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'keywords_txt', '', '');
    }

    getTypeValues(searchResult: CommonDocSearchResult<CommonDocRecord, CommonDocSearchForm>): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'type_txt', '', '');
    }

    getTypeLimit(searchResult: CommonDocSearchResult<CommonDocRecord, CommonDocSearchForm>): number {
        if (searchResult === undefined || searchResult.facets === undefined || searchResult.facets.facets.size === 0) {
            return 0;
        }

        return this.searchParameterUtils.extractFacetSelectLimit(searchResult.facets, 'type_txt');
    }

    getPlaylistValues(searchResult: CommonDocSearchResult<CommonDocRecord, CommonDocSearchForm>): any[] {
         return this.searchFormUtils.getFacetValues(searchResult, 'playlists_txt', '', '');
    }
}
