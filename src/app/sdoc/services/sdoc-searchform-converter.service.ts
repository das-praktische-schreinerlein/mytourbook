import {Injectable} from '@angular/core';
import {SDocSearchForm} from '../model/forms/sdoc-searchform';
import {GenericSearchFormSearchFormConverter} from '../../../commons/services/generic-searchform-converter.service';
import {SearchFormUtils} from '../../../commons/services/searchform-utils.service';

@Injectable()
export class SDocSearchFormConverter implements GenericSearchFormSearchFormConverter<SDocSearchForm> {
    private splitter = '_,_';

    constructor(private searchFormUtils: SearchFormUtils) {
    }

    searchFormToUrl(baseUrl: string, sdocSearchForm: SDocSearchForm): string {
        let url = baseUrl;
        const searchForm = (sdocSearchForm ? sdocSearchForm : new SDocSearchForm({}));

        const whereMap = new Map();
        whereMap.set('locId', searchForm.locId);
        whereMap.set('loc', searchForm.where);
        whereMap.set('nearby', searchForm.nearby);
        whereMap.set('nearbyAddress', searchForm.nearbyAddress);
        const where = this.searchFormUtils.joinParamsToOneRouteParameter(whereMap, this.splitter);

        const params: Object[] = [
            this.searchFormUtils.useValueOrDefault(searchForm.when, 'jederzeit'),
            this.searchFormUtils.useValueOrDefault(where, 'ueberall'),
            this.searchFormUtils.useValueOrDefault(searchForm.what, 'alles'),
            this.searchFormUtils.useValueOrDefault(searchForm.fulltext, 'egal'),
            this.searchFormUtils.useValueOrDefault(searchForm.moreFilter, 'ungefiltert'),
            this.searchFormUtils.useValueOrDefault(searchForm.sort, 'relevanz'),
            this.searchFormUtils.useValueOrDefault(searchForm.type, 'alle'),
            +searchForm.perPage || 10,
            +searchForm.pageNum || 1
        ];
        url += params.join('/');

        return url;
    }

    paramsToSearchForm(params: any, defaults: {}, searchForm: SDocSearchForm): void {
        params = params || {};
        defaults = defaults || {};
        const whereValues = this.searchFormUtils.splitValuesByPrefixes(params.where, this.splitter,
            ['locId:', 'loc:', 'nearby:', 'nearbyAddress:']);
        let where = '';
        if (whereValues.has('loc:')) {
           where = this.searchFormUtils.joinValuesAndReplacePrefix(whereValues.get('loc:'), 'loc:', ',');
        }
        if (whereValues.has('unknown')) {
            where += ',' + this.searchFormUtils.joinValuesAndReplacePrefix(whereValues.get('unknown'), '', ',');
        }
        where = where.replace(/[,]+/g, ',').replace(/(^,)|(,$)/g, '');
        const nearby: string = (whereValues.has('nearby:') ?
            this.searchFormUtils.joinValuesAndReplacePrefix(whereValues.get('nearby:'), 'nearby:', ',') : '');
        const nearbyAddress: string = (whereValues.has('nearbyAddress:') ?
            this.searchFormUtils.joinValuesAndReplacePrefix(whereValues.get('nearbyAddress:'), 'nearbyAddress:', ',') : '');
        const locId: string = (whereValues.has('locId:') ?
            this.searchFormUtils.joinValuesAndReplacePrefix(whereValues.get('locId:'), 'locId:', ',') : '');

        searchForm.theme = this.searchFormUtils.useValueDefaultOrFallback(
            this.searchFormUtils.replacePlaceHolder(params['theme'], /^alle$/, ''),
            defaults['theme'], '');
        searchForm.when = this.searchFormUtils.useValueDefaultOrFallback(
            this.searchFormUtils.replacePlaceHolder(params['when'], /^jederzeit$/, ''),
            defaults['when'], '');
        searchForm.where = this.searchFormUtils.useValueDefaultOrFallback(
            this.searchFormUtils.replacePlaceHolder(where, /^ueberall$/, ''),
            defaults['where'], '');
        searchForm.locId = this.searchFormUtils.useValueDefaultOrFallback(
            this.searchFormUtils.replacePlaceHolder(locId, /^ueberall$/, ''),
            defaults['locId'], '');
        searchForm.nearby = this.searchFormUtils.useValueDefaultOrFallback(
            this.searchFormUtils.replacePlaceHolder(nearby, /^ueberall$/, ''),
            defaults['nearby'], '');
        searchForm.nearbyAddress = this.searchFormUtils.useValueDefaultOrFallback(
            this.searchFormUtils.replacePlaceHolder(nearbyAddress, /^ueberall$/, ''),
            defaults['nearbyAddress'], '');
        searchForm.what = this.searchFormUtils.useValueDefaultOrFallback(
            this.searchFormUtils.replacePlaceHolder(params['what'], /^alles$/, ''),
            defaults['what'], '');
        searchForm.fulltext = this.searchFormUtils.useValueDefaultOrFallback(
            this.searchFormUtils.replacePlaceHolder(params['fulltext'], /^egal$/, ''),
            defaults['fulltext'], '');
        searchForm.moreFilter = this.searchFormUtils.useValueDefaultOrFallback(
            this.searchFormUtils.replacePlaceHolder(params['moreFilter'], /^ungefiltert$/, ''),
            defaults['moreFilter'], '');
        searchForm.sort = this.searchFormUtils.useValueDefaultOrFallback(params['sort'], defaults['sort'], '');
        searchForm.type = this.searchFormUtils.useValueDefaultOrFallback(
            this.searchFormUtils.replacePlaceHolder(params['type'], /^alle$/, ''), defaults['type'], '');
        searchForm.perPage = +params['perPage'] || 10;
        searchForm.pageNum = +params['pageNum'] || 1;
    }

}
