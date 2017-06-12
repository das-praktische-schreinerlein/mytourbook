import {Injectable} from '@angular/core';
import {SDocSearchForm} from '../model/forms/sdoc-searchform';
import {GenericSearchFormSearchFormConverter} from './generic-searchform-converter.service';

@Injectable()
export class SDocSearchFormConverter implements GenericSearchFormSearchFormConverter<SDocSearchForm> {
    searchFormToUrl(baseUrl: string, searchForm: SDocSearchForm): string {
        let url = baseUrl;
        const params: Object[] = [
            searchForm.when || 'jederzeit',
            searchForm.where || 'ueberall',
            searchForm.what || 'alles',
            searchForm.fulltext || 'egal',
            'ungefiltert',
            searchForm.sort || 'relevanz',
            searchForm.type || 'alle',
            +searchForm.perPage || 10,
            +searchForm.pageNum || 1
        ];
        url += params.join('/');

        return url;
    }

    paramsToSearchForm(params: any, searchForm: SDocSearchForm): void {
        searchForm.when = (params['when'] || '').replace(/^jederzeit/, '');
        searchForm.where = (params['where'] || '').replace(/^ueberall/, '');
        searchForm.what = (params['what'] || '').replace(/^alles/, '');
        searchForm.fulltext = (params['fulltext'] || '').replace(/^egal$/, '');
        searchForm.sort = params['sort'] || '';
        searchForm.type = (params['type'] || '').replace(/^alle/, '');
        searchForm.perPage = +params['perPage'] || 10;
        searchForm.pageNum = +params['pageNum'] || 1;
    }
}
