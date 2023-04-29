import {Injectable} from '@angular/core';
import {PDocSearchForm, PDocSearchFormValidator} from '@dps/mycms-commons/dist/pdoc-commons/model/forms/pdoc-searchform';
import {
    GenericSearchFormSearchFormConverter,
    HumanReadableFilter
} from '@dps/mycms-commons/dist/search-commons/services/generic-searchform.converter';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {TranslateService} from '@ngx-translate/core';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {Layout, LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';

@Injectable()
export class PDocSearchFormConverter implements GenericSearchFormSearchFormConverter<PDocSearchForm> {
    public readonly splitter = '_,_';
    public HRD_IDS = {
        pageid_i: 'PAGE',
        page_id_is: 'PAGE'
    };

    constructor(private searchParameterUtils: SearchParameterUtils, private translateService: TranslateService,
                private searchFormUtils: SearchFormUtils) {
    }

    isValid(searchForm: PDocSearchForm): boolean {
        return PDocSearchFormValidator.isValid(searchForm);
    }

    newSearchForm(values: {}): PDocSearchForm {
        return new PDocSearchForm(values);
    }

    parseLayoutParams(values: {}, pdocSearchForm: PDocSearchForm): Layout {
        if (!values || !values['layout']) {
            return undefined;
        }

        return LayoutService.layoutFromString(values['layout']);
    }

    joinMoreFilterParams(pdocSearchForm: PDocSearchForm): string {
        const searchForm = (pdocSearchForm ? pdocSearchForm : new PDocSearchForm({}));
        const moreFilterMap = new Map();
        let moreFilter = this.searchParameterUtils.joinParamsToOneRouteParameter(moreFilterMap, this.splitter);
        if (moreFilter !== undefined && moreFilter.length > 0) {
            if (searchForm.moreFilter !== undefined && searchForm.moreFilter.length > 0) {
                moreFilter = [moreFilter, searchForm.moreFilter].join(this.splitter);
            }
        } else {
            moreFilter = searchForm.moreFilter;
        }
        return moreFilter;
    }

    joinWhatParams(pdocSearchForm: PDocSearchForm): string {
        const searchForm = (pdocSearchForm ? pdocSearchForm : new PDocSearchForm({}));
        const whatMap = new Map();
        whatMap.set('keyword', searchForm.what);
        whatMap.set('subtype', searchForm.subtype);
        whatMap.set('initial', searchForm.initial);
        return this.searchParameterUtils.joinParamsToOneRouteParameter(whatMap, this.splitter);
    }

    searchFormToValueMap(pdocSearchForm: PDocSearchForm): {[key: string]: string } {
        const searchForm = (pdocSearchForm ? pdocSearchForm : new PDocSearchForm({}));

        const moreFilter = this.joinMoreFilterParams(searchForm);
        const what = this.joinWhatParams(searchForm);

        const params: {[key: string]: string } = {
            what: this.searchParameterUtils.joinAndUseValueOrDefault(what, 'alles'),
            fulltext: this.searchParameterUtils.joinAndUseValueOrDefault(searchForm.fulltext, 'egal'),
            moreFilter: this.searchParameterUtils.joinAndUseValueOrDefault(moreFilter, 'ungefiltert'),
            sort: this.searchParameterUtils.joinAndUseValueOrDefault(searchForm.sort, 'relevance'),
            type: this.searchParameterUtils.joinAndUseValueOrDefault(searchForm.type, 'alle'),
            perPage: (+searchForm.perPage || 10) + '',
            pageNum: (+searchForm.pageNum || 1) + ''
        };

        return params;
    }

    searchFormToUrl(baseUrl: string, pdocSearchForm: PDocSearchForm): string {
        let url = baseUrl + 'search/';
        const searchForm = (pdocSearchForm ? pdocSearchForm : new PDocSearchForm({}));

        const moreFilter = this.joinMoreFilterParams(searchForm);
        const what = this.joinWhatParams(searchForm);

        const params: Object[] = [
            this.searchParameterUtils.joinAndUseValueOrDefault(what, 'alles'),
            this.searchParameterUtils.joinAndUseValueOrDefault(searchForm.fulltext, 'egal'),
            this.searchParameterUtils.joinAndUseValueOrDefault(moreFilter, 'ungefiltert'),
            this.searchParameterUtils.joinAndUseValueOrDefault(searchForm.sort, 'relevance'),
            this.searchParameterUtils.joinAndUseValueOrDefault(searchForm.type, 'alle'),
            +searchForm.perPage || 10,
            +searchForm.pageNum || 1
        ];
        url += params.join('/');

        const queryParameter = [];
        if (searchForm['layout'] !== undefined) {
            queryParameter.push('layout=' + LayoutService.layoutToString(searchForm['layout']));
        }

        if (searchForm['hideForm']) {
            queryParameter.push('hideForm=true');
        }

        if (queryParameter.length > 0) {
            url += '?' + queryParameter.join('&');
        }

        return url;
    }

    paramsToSearchForm(params: any, defaults: {}, searchForm: PDocSearchForm, queryParams?: {}): void {
        params = params || {};
        defaults = defaults || {};

        const moreFilterValues = this.searchParameterUtils.splitValuesByPrefixes(params.moreFilter, this.splitter,
            []);
        let moreFilter = '';
        if (moreFilterValues.has('unknown')) {
            moreFilter += ',' + this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get('unknown'), '', ',');
        }
        moreFilter = moreFilter.replace(/[,]+/g, ',').replace(/(^,)|(,$)/g, '');

        const whatFilterValues = this.searchParameterUtils.splitValuesByPrefixes(params.what, this.splitter,
            ['subtype:', 'initial:']);
        const subtype: string = (whatFilterValues.has('subtype:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(whatFilterValues.get('subtype:'), 'subtype:', ',') : '');
        const initial: string = (whatFilterValues.has('initial:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(whatFilterValues.get('initial:'), 'initial:', ',') : '');

        searchForm.subtype = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(subtype, /^alles$/, ''),
            defaults['subtype'], '');
        searchForm.initial = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(initial, /^alles$/, ''),
            defaults['initial'], '');
        searchForm.fulltext = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(params['fulltext'], /^egal$/, ''),
            defaults['fulltext'], '');
        searchForm.moreFilter = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(moreFilter, /^ungefiltert$/, ''),
            defaults['moreFilter'], '');

        searchForm.sort = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(params['sort'], defaults['sort'], '');
        searchForm.type = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(params['type'], /^alle$/, ''), defaults['type'], '').toLowerCase();
        searchForm.perPage = +params['perPage'] || 10;
        searchForm.pageNum = +params['pageNum'] || 1;

        const layout = this.parseLayoutParams(queryParams, searchForm);
        if (layout !== undefined) {
            searchForm['layout'] = layout;
        }

        if (queryParams !== undefined && (queryParams['hideForm'] === true || queryParams['hideForm'] === 'true')) {
            searchForm['hideForm'] = true;
        }
    }

    searchFormToHumanReadableText(filters: HumanReadableFilter[], textOnly: boolean, obJCache: Map<string, string>): string {
        return this.searchFormUtils.searchFormToHumanReadableMarkup(filters, true, obJCache, this.getHrdIds());
    }

    searchFormToHumanReadableFilter(searchForm: PDocSearchForm): HumanReadableFilter[] {
        const pdocSearchForm = (searchForm ? searchForm : new PDocSearchForm({}));

        const res: HumanReadableFilter[] = [];
        res.push(this.translateService.instant('hrt_search') || 'search');
        res.push(this.searchFormUtils.valueToHumanReadableText(pdocSearchForm.type, 'hrt_type', 'hrt_alltypes', true));

        const moreFilterNames = Object.getOwnPropertyNames(this.getHrdIds()).concat(['noRoute']);
        const moreFilterValues = this.searchParameterUtils.splitValuesByPrefixes(pdocSearchForm.moreFilter, this.splitter, moreFilterNames);
        moreFilterValues.forEach((value, key) => {
            const moreValue = this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get(key), key + ':', ',');
            res.push(this.searchFormUtils.valueToHumanReadableText(moreValue, key === 'unknown' ? 'hrt_moreFilter' : 'hrt_' + key,
                undefined, true));
        });

        res.push(this.searchFormUtils.valueToHumanReadableText(pdocSearchForm.fulltext, 'hrt_fulltext', undefined, true));
        res.push(this.searchFormUtils.valueToHumanReadableText(pdocSearchForm.initial, 'hrt_initial', undefined, true));

        return res;
    }

    getHrdIds(): {} {
        return this.HRD_IDS;
    }

}
