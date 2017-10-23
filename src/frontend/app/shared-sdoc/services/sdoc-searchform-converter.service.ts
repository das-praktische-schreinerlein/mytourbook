import {Injectable} from '@angular/core';
import {SDocSearchForm} from '../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {GenericSearchFormSearchFormConverter} from '../../../shared/search-commons/services/generic-searchform.converter';
import {SearchParameterUtils} from '../../../shared/search-commons/services/searchparameter.utils';
import {TranslateService} from '@ngx-translate/core';

export interface HumanReadableFilter {
    id: string;
    prefix: string;
    values: string[];
}

@Injectable()
export class SDocSearchFormConverter implements GenericSearchFormSearchFormConverter<SDocSearchForm> {
    private splitter = '_,_';

    constructor(private searchParameterUtils: SearchParameterUtils, private translateService: TranslateService) {
    }


    joinWhereParams(sdocSearchForm: SDocSearchForm): string {
        const searchForm = (sdocSearchForm ? sdocSearchForm : new SDocSearchForm({}));
        const whereMap = new Map();
        whereMap.set('locId', searchForm.locId);
        whereMap.set('loc', searchForm.where);
        whereMap.set('nearby', searchForm.nearby);
        whereMap.set('nearbyAddress', searchForm.nearbyAddress);
        return this.searchParameterUtils.joinParamsToOneRouteParameter(whereMap, this.splitter);
    }

    joinMoreFilterParams(sdocSearchForm: SDocSearchForm): string {
        const searchForm = (sdocSearchForm ? sdocSearchForm : new SDocSearchForm({}));
        const moreFilterMap = new Map();
        moreFilterMap.set('techDataAltitudeMax', searchForm.techDataAltitudeMax);
        moreFilterMap.set('techDataAscent', searchForm.techDataAscent);
        moreFilterMap.set('techDataDistance', searchForm.techDataDistance);
        moreFilterMap.set('techDataDuration', searchForm.techDataDuration);
        moreFilterMap.set('techRateOverall', searchForm.techRateOverall);
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

    joinWhatParams(sdocSearchForm: SDocSearchForm): string {
        const searchForm = (sdocSearchForm ? sdocSearchForm : new SDocSearchForm({}));
        const whatMap = new Map();
        whatMap.set('keyword', searchForm.what);
        whatMap.set('action', searchForm.actiontype);
        return this.searchParameterUtils.joinParamsToOneRouteParameter(whatMap, this.splitter);
    }

    searchFormToUrl(baseUrl: string, sdocSearchForm: SDocSearchForm): string {
        let url = baseUrl + 'search/';
        const searchForm = (sdocSearchForm ? sdocSearchForm : new SDocSearchForm({}));

        const where = this.joinWhereParams(searchForm);
        const moreFilter = this.joinMoreFilterParams(searchForm);
        const what = this.joinWhatParams(searchForm);

        const params: Object[] = [
            this.searchParameterUtils.useValueOrDefault(searchForm.when, 'jederzeit'),
            this.searchParameterUtils.useValueOrDefault(where, 'ueberall'),
            this.searchParameterUtils.useValueOrDefault(what, 'alles'),
            this.searchParameterUtils.useValueOrDefault(searchForm.fulltext, 'egal'),
            this.searchParameterUtils.useValueOrDefault(moreFilter, 'ungefiltert'),
            this.searchParameterUtils.useValueOrDefault(searchForm.sort, 'relevance'),
            this.searchParameterUtils.useValueOrDefault(searchForm.type, 'alle'),
            +searchForm.perPage || 10,
            +searchForm.pageNum || 1
        ];
        url += params.join('/');

        return url;
    }

    paramsToSearchForm(params: any, defaults: {}, searchForm: SDocSearchForm): void {
        params = params || {};
        defaults = defaults || {};
        const whereValues = this.searchParameterUtils.splitValuesByPrefixes(params.where, this.splitter,
            ['locId:', 'loc:', 'nearby:', 'nearbyAddress:']);
        let where = '';
        if (whereValues.has('loc:')) {
            where = this.searchParameterUtils.joinValuesAndReplacePrefix(whereValues.get('loc:'), 'loc:', ',');
        }
        if (whereValues.has('unknown')) {
            where += ',' + this.searchParameterUtils.joinValuesAndReplacePrefix(whereValues.get('unknown'), '', ',');
        }
        where = where.replace(/[,]+/g, ',').replace(/(^,)|(,$)/g, '');
        const nearby: string = (whereValues.has('nearby:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(whereValues.get('nearby:'), 'nearby:', ',') : '');
        const nearbyAddress: string = (whereValues.has('nearbyAddress:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(whereValues.get('nearbyAddress:'), 'nearbyAddress:', ',') : '');
        const locId: string = (whereValues.has('locId:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(whereValues.get('locId:'), 'locId:', ',') : '');

        const moreFilterValues = this.searchParameterUtils.splitValuesByPrefixes(params.moreFilter, this.splitter,
            ['techDataAltitudeMax:', 'techDataAscent:', 'techDataDistance:', 'techDataDuration:', 'techRateOverall:']);
        let moreFilter = '';
        if (moreFilterValues.has('unknown')) {
            moreFilter += ',' + this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get('unknown'), '', ',');
        }
        moreFilter = moreFilter.replace(/[,]+/g, ',').replace(/(^,)|(,$)/g, '');
        const techDataAltitudeMax: string = (moreFilterValues.has('techDataAltitudeMax:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(
                moreFilterValues.get('techDataAltitudeMax:'), 'techDataAltitudeMax:', ',') : '');
        const techDataAscent: string = (moreFilterValues.has('techDataAscent:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get('techDataAscent:'), 'techDataAscent:', ',') : '');
        const techDataDistance: string = (moreFilterValues.has('techDataDistance:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get('techDataDistance:'), 'techDataDistance:', ',') : '');
        const techDataDuration: string = (moreFilterValues.has('techDataDuration:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get('techDataDuration:'), 'techDataDuration:', ',') : '');
        const techRateOverall: string = (moreFilterValues.has('techRateOverall:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get('techRateOverall:'), 'techRateOverall:', ',') : '');

        const whatFilterValues = this.searchParameterUtils.splitValuesByPrefixes(params.what, this.splitter,
            ['action:', 'keyword:']);
        let whatFilter = '';
        if (whatFilterValues.has('unknown')) {
            whatFilter += ',' + this.searchParameterUtils.joinValuesAndReplacePrefix(whatFilterValues.get('unknown'), '', ',');
        }
        whatFilter = whatFilter.replace(/[,]+/g, ',').replace(/(^,)|(,$)/g, '');
        const what: string = (whatFilterValues.has('keyword:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(
                whatFilterValues.get('keyword:'), 'keyword:', ',') : '');
        const actiontype: string = (whatFilterValues.has('action:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(whatFilterValues.get('action:'), 'action:', ',') : '');

        searchForm.theme = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(params['theme'], /^alle$/, ''),
            defaults['theme'], '');
        searchForm.when = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(params['when'], /^jederzeit$/, ''),
            defaults['when'], '');
        searchForm.where = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(where, /^ueberall$/, ''),
            defaults['where'], '');
        searchForm.locId = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(locId, /^ueberall$/, ''),
            defaults['locId'], '');
        searchForm.nearby = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(nearby, /^ueberall$/, ''),
            defaults['nearby'], '');
        searchForm.nearbyAddress = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(nearbyAddress, /^ueberall$/, ''),
            defaults['nearbyAddress'], '');
        searchForm.what = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(what, /^alles$/, ''),
            defaults['what'], '');
        searchForm.actiontype = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(actiontype, /^alles$/, ''),
            defaults['actiontype'], '');
        searchForm.fulltext = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(params['fulltext'], /^egal$/, ''),
            defaults['fulltext'], '');
        searchForm.moreFilter = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(moreFilter, /^ungefiltert$/, ''),
            defaults['moreFilter'], '');
        searchForm.techRateOverall = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(techRateOverall, /^ungefiltert$/, ''),
            defaults['techRateOverall'], '');
        searchForm.techDataAscent = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(techDataAscent, /^ungefiltert$/, ''),
            defaults['techDataAscent'], '');
        searchForm.techDataDuration = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(techDataDuration, /^ungefiltert$/, ''),
            defaults['techDataDuration'], '');
        searchForm.techDataDistance = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(techDataDistance, /^ungefiltert$/, ''),
            defaults['techDataDistance'], '');
        searchForm.techDataAltitudeMax = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(techDataAltitudeMax, /^ungefiltert$/, ''),
            defaults['techDataAltitudeMax'], '');
        searchForm.sort = this.searchParameterUtils.useValueDefaultOrFallback(params['sort'], defaults['sort'], '');
        searchForm.type = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(params['type'], /^alle$/, ''), defaults['type'], '').toLowerCase();
        searchForm.perPage = +params['perPage'] || 10;
        searchForm.pageNum = +params['pageNum'] || 1;
    }

    searchFormToHumanReadableText(sdocSearchForm: SDocSearchForm, textOnly: boolean): string {
        return this.searchFormToHumanReadableMarkup(sdocSearchForm, true);
    }

    searchFormToHumanReadableMarkup(sdocSearchForm: SDocSearchForm, textOnly: boolean): string {
        const filters: HumanReadableFilter[] = this.searchFormToHumanReadableFilter(sdocSearchForm);
        const str = [];

        for (const filter of filters) {
            if (filter && filter.values && filter.values.length > 0) {
                if (textOnly) {
                    str.push([(filter.prefix ? filter.prefix + ' ' : ''), '"', filter.values.join(','), '"'].join(' '));
                } else {
                    str.push(['<div class="filter filter_' + filter.id + '">',
                        '<span class="filterPrefix filterPrefix_' + filter.id + '">', (filter.prefix ? filter.prefix + ' ' : ''), '</span>',
                        '<span class="filterValue filterValue_' + filter.id + '">', '"', filter.values.join(','), '"', '</span>', '</div>'
                    ].join(''));
                }
            }
        }

        return str.join(' ');
    }

    searchFormToHumanReadableFilter(sdocSearchForm: SDocSearchForm): HumanReadableFilter[] {
        const searchForm = (sdocSearchForm ? sdocSearchForm : new SDocSearchForm({}));

        const res: HumanReadableFilter[] = [];
        res.push(this.translateService.instant('hrt_search') || 'search');
        res.push(this.valueToHumanReadableText(sdocSearchForm.type, 'hrt_type', 'hrt_alltypes', true));
        res.push(this.valueToHumanReadableText(sdocSearchForm.where, 'hrt_in', undefined, true));
        res.push(this.valueToHumanReadableText(sdocSearchForm.nearbyAddress, 'hrt_nearby', undefined, true));
        res.push(this.valueToHumanReadableText(sdocSearchForm.actiontype, 'hrt_actiontype', undefined, true));

        const when = (sdocSearchForm.when ? sdocSearchForm.when : '')
            .replace(new RegExp('month', 'g'), 'Monat')
            .replace(new RegExp('week', 'g'), 'Woche');
        res.push(this.valueToHumanReadableText(when, 'hrt_when', undefined, true));
        const what = (sdocSearchForm.what ? sdocSearchForm.what : '')
            .replace(new RegExp('kw_', 'g'), '');
        res.push(this.valueToHumanReadableText(what, 'hrt_keyword', undefined, true));

        const moreFilterValues = this.searchParameterUtils.splitValuesByPrefixes(sdocSearchForm.moreFilter, this.splitter,
            ['track_id_i', 'trip_id_i', 'trip_id_is', 'news_id_i', 'news_id_is', 'loc_id_i', 'loc_lochirarchie_ids_txt',
                'image_id_i', 'route_id_i', 'route_id_is', 'loc_parent_id_i']);
        moreFilterValues.forEach((value, key) => {
            const moreValue = this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get(key), key + ':', ',');
            res.push(this.valueToHumanReadableText(moreValue, key === 'unknown' ? 'hrt_moreFilter' : 'hrt_' + key, undefined, true));
        });

        res.push(this.valueToHumanReadableText(sdocSearchForm.fulltext, 'hrt_fulltext', undefined, true));
        res.push(this.valueToHumanReadableText(sdocSearchForm.techDataAltitudeMax, 'hrt_techDataAltitudeMax', undefined, true));
        res.push(this.valueToHumanReadableText(sdocSearchForm.techDataAscent, 'hrt_techDataAscent', undefined, true));
        res.push(this.valueToHumanReadableText(sdocSearchForm.techDataDistance, 'hrt_techDataDistance', undefined, true));
        res.push(this.valueToHumanReadableText(sdocSearchForm.techDataDuration, 'hrt_techDataDuration', undefined, true));
        res.push(this.valueToHumanReadableText(sdocSearchForm.techRateOverall, 'hrt_techRateOverall', undefined, true));

        return res;
    }

    private valueToHumanReadableText(valueString: any, prefix: string, defaultValue: string, translate: boolean): HumanReadableFilter {
        let res: HumanReadableFilter;
        if (valueString && valueString.toString() !== '') {
            res = {
                id: prefix,
                prefix: undefined,
                values: []
            };
            if (prefix) {
                res.prefix = (translate ? this.translateService.instant(prefix) : prefix);
            }
            const values = valueString.toString().split(',');
            for (const value of values) {
                const safeValue = this.searchParameterUtils.escapeHtml(value);
                res.values.push((translate ? this.translateService.instant(safeValue) || safeValue : safeValue));
            }
        } else if (defaultValue) {
            res = {
                id: prefix,
                prefix: undefined,
                values: []
            };
            if (prefix) {
                res.prefix = (translate ? this.translateService.instant(prefix) : prefix);
            }
            res.values.push((translate ? this.translateService.instant(defaultValue) : defaultValue));
        }

        return res;
    }
}
