import {Injectable} from '@angular/core';
import {PDocSearchResult} from '@dps/mycms-commons/dist/pdoc-commons/model/container/pdoc-searchresult';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {CommonDocSearchFormUtils} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-searchform-utils.service';

@Injectable()
export class PDocSearchFormUtils extends CommonDocSearchFormUtils {

    constructor(protected searchFormUtils: SearchFormUtils, protected searchParameterUtils: SearchParameterUtils) {
        super(searchFormUtils, searchParameterUtils);
    }

    getSubTypeValues(searchResult: PDocSearchResult): any[] {
        return this.searchFormUtils.getFacetValues(searchResult, 'subtype_ss', '', '');
    }

    getKeyValues(searchResult: PDocSearchResult): any[] {
        return this.searchFormUtils.getFacetValues(searchResult, 'key_ss', '', '');
    }

    getLangkeyValues(searchResult: PDocSearchResult): any[] {
        return this.searchFormUtils.getFacetValues(searchResult, 'langkey_ss', '', '');
    }

    getThemeValues(searchResult: PDocSearchResult): any[] {
        return this.searchFormUtils.getFacetValues(searchResult, 'theme_ss', '', '');
    }
}
