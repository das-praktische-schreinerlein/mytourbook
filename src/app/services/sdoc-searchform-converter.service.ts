import {Injectable} from '@angular/core';
import {SDocSearchForm} from '../model/forms/sdoc-searchform';
import {GenericSearchFormSearchFormConverter} from './generic-searchform-converter.service';

@Injectable()
export class SDocSearchFormConverter implements GenericSearchFormSearchFormConverter<SDocSearchForm> {
    searchFormToUrl(baseUrl: string, sdocSearchForm: SDocSearchForm): string {
        let url = baseUrl;
        const searchForm = (sdocSearchForm ? sdocSearchForm : new SDocSearchForm({}));
        const params: Object[] = [
            this.useValueOrDefault(searchForm.when, 'jederzeit'),
            this.useValueOrDefault(searchForm.where, 'ueberall'),
            this.useValueOrDefault(searchForm.what, 'alles'),
            this.useValueOrDefault(searchForm.fulltext, 'egal'),
            this.useValueOrDefault(searchForm.moreFilter, 'ungefiltert'),
            this.useValueOrDefault(searchForm.sort, 'relevanz'),
            this.useValueOrDefault(searchForm.type, 'alle'),
            +searchForm.perPage || 10,
            +searchForm.pageNum || 1
        ];
        url += params.join('/');

        return url;
    }

    paramsToSearchForm(params: any, searchForm: SDocSearchForm): void {
        searchForm.when = (params['when'] || '').replace(/^jederzeit/, '');
        searchForm.where = (this.useValueOrDefault(params['where'], '')).replace(/^ueberall/, '');
        searchForm.what = (this.useValueOrDefault(params['what'], '')).replace(/^alles/, '');
        searchForm.fulltext = (this.useValueOrDefault(params['fulltext'], '')).replace(/^egal$/, '');
        searchForm.moreFilter = (this.useValueOrDefault(params['moreFilter'], '')).replace(/^ungefiltert$/, '');
        searchForm.sort = this.useValueOrDefault(params['sort'], '');
        searchForm.type = (this.useValueOrDefault(params['type'], '')).replace(/^alle/, '');
        searchForm.perPage = +params['perPage'] || 10;
        searchForm.pageNum = +params['pageNum'] || 1;
    }

    useValueOrDefault(value: any, defaultValue: any) {
        if (value === undefined || value === null || value === '') {
            return defaultValue;
        }

        return value;
    }
}
