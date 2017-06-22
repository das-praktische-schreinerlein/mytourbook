import {Injectable} from '@angular/core';
import {SDocSearchForm} from '../model/forms/sdoc-searchform';
import {GenericSearchFormSearchFormConverter} from '../../commons/services/generic-searchform-converter.service';

@Injectable()
export class SDocSearchFormConverter implements GenericSearchFormSearchFormConverter<SDocSearchForm> {
    searchFormToUrl(baseUrl: string, sdocSearchForm: SDocSearchForm): string {
        let url = baseUrl;
        const searchForm = (sdocSearchForm ? sdocSearchForm : new SDocSearchForm({}));

        let nearby: string = this.useValueOrDefault(searchForm.nearby, '');
        if (nearby.length > 0) {
            nearby = 'nearby:' + nearby;
        }
        let where = [this.useValueOrDefault(searchForm.where, ''), nearby].join(',');
        where = where.replace(/[,]+/g, ',').replace(/(^,)|(,$)/g, '');

        const params: Object[] = [
            this.useValueOrDefault(searchForm.when, 'jederzeit'),
            this.useValueOrDefault(where, 'ueberall'),
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
        let where: string = this.useValueOrDefault(params.where, '');
        let nearby = undefined;
        const matches =  where.match(/^(.*)nearby:([0-9.]+?_[0-9.]+?_[0-9]+)(.*?)$/i);
        if (matches && matches.length === 4) {
            nearby = this.useValueOrDefault(matches[2], '');
            where = [this.useValueOrDefault(matches[1], ''), this.useValueOrDefault(matches[3], '')].join(',');
        }
        where = where.replace(/[,]+/g, ',').replace(/(^,)|(,$)/g, '');

        searchForm.when = (params['when'] || '').replace(/^jederzeit/, '');
        searchForm.where = (this.useValueOrDefault(where, '')).replace(/^ueberall/, '');
        searchForm.nearby = (this.useValueOrDefault(nearby, '')).replace(/^ueberall/, '');
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
        if (value instanceof Array && (value.length === 0 || (value.length === 1 && value[0] === ''))) {
            return [defaultValue];
        }

        return value;
    }
}
