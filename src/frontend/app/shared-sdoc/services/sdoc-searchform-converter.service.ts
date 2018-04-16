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
    public HRD_IDS = {
        track_id_i: 'TRACK',
        track_id_is: 'TRACK',
        trip_id_i: 'TRIP',
        trip_id_is: 'TRIP',
        news_id_i: 'NEWS',
        news_id_is: 'NEWS',
        loc_id_i: 'LOCATION',
        loc_lochirarchie_ids_txt: 'LOCATION',
        image_id_i: 'IMAGE',
        video_id_i: 'VIDEO',
        route_id_i: 'ROUTE',
        route_id_is: 'ROUTE',
        loc_parent_id_i: 'LOCATION'};

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
        moreFilterMap.set('personalRateDifficulty', searchForm.personalRateDifficulty);
        moreFilterMap.set('personalRateOverall', searchForm.personalRateOverall);
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
        whatMap.set('persons', searchForm.persons);
        whatMap.set('playlists', searchForm.playlists);
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
            ['techDataAltitudeMax:', 'techDataAscent:', 'techDataDistance:', 'techDataDuration:', 'techRateOverall:',
            'personalRateOverall:', 'personalRateDifficulty:']);
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
        const personalRateOverall: string = (moreFilterValues.has('personalRateOverall:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get('personalRateOverall:'), 'personalRateOverall:',
                ',') : '');
        const personalRateDifficulty: string = (moreFilterValues.has('personalRateDifficulty:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get('personalRateDifficulty:'), 'personalRateDifficulty:',
                ',') : '');

        const whatFilterValues = this.searchParameterUtils.splitValuesByPrefixes(params.what, this.splitter,
            ['action:', 'keyword:', 'playlists:', 'persons:']);
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
        const playlists: string = (whatFilterValues.has('playlists:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(whatFilterValues.get('playlists:'), 'playlists:', ',') : '');
        const persons: string = (whatFilterValues.has('persons:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(whatFilterValues.get('persons:'), 'persons:', ',') : '');

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
        searchForm.playlists = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(playlists, /^alles$/, ''),
            defaults['playlists'], '');
        searchForm.persons = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(persons, /^alles$/, ''),
            defaults['persons'], '');
        searchForm.fulltext = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(params['fulltext'], /^egal$/, ''),
            defaults['fulltext'], '');
        searchForm.moreFilter = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(moreFilter, /^ungefiltert$/, ''),
            defaults['moreFilter'], '');
        searchForm.techRateOverall = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(techRateOverall, /^ungefiltert$/, ''),
            defaults['techRateOverall'], '');
        searchForm.personalRateOverall = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(personalRateOverall, /^ungefiltert$/, ''),
            defaults['personalRateOverall'], '');
        searchForm.personalRateDifficulty = this.searchParameterUtils.useValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(personalRateDifficulty, /^ungefiltert$/, ''),
            defaults['personalRateDifficulty'], '');
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

    searchFormToHumanReadableText(filters: HumanReadableFilter[], textOnly: boolean, obJCache: Map<string, string>): string {
        return this.searchFormToHumanReadableMarkup(filters, true, obJCache);
    }

    searchFormToHumanReadableMarkup(filters: HumanReadableFilter[], textOnly: boolean, objCache: Map<string, string>): string {
        const str = [];

        for (const filter of filters) {
            if (filter && filter.values && filter.values.length > 0) {
                let resolvedValues = [];
                if (objCache) {
                    for (const value of filter.values) {
                        const resolvedValue = objCache.get(this.HRD_IDS[filter.id.replace('hrt_', '')] + '_' + value);
                        resolvedValues.push(resolvedValue ? resolvedValue : value);
                    }
                } else {
                    resolvedValues = filter.values;
                }
                if (textOnly) {
                    str.push([(filter.prefix ? filter.prefix + ' ' : ''), '"', resolvedValues.join(','), '"'].join(' '));
                } else {
                    str.push(['<div class="filter filter_' + filter.id + '">',
                        '<span class="filterPrefix filterPrefix_' + filter.id + '">', (filter.prefix ? filter.prefix + ' ' : ''), '</span>',
                        '<span class="filterValue filterValue_' + filter.id + '">', '"', resolvedValues.join(','), '"', '</span>', '</div>'
                    ].join(''));
                }
            }
        }

        return str.join(' ');
    }

    extractResolvableFilters(filters: HumanReadableFilter[]): HumanReadableFilter[] {
        const res: HumanReadableFilter[] = [];
        for (const filter of filters) {
            if (!filter || !filter.values || filter.values.length <= 0 || !this.HRD_IDS[filter.id.replace('hrt_', '')]) {
                continue;
            }
            res.push(filter);
        }

        return res;
    }
    extractResolvableIds(filters: HumanReadableFilter[]): Map<string, string> {
        const obJCache = new Map<string, string>();

        for (const filter of filters) {
            if (!filter || !filter.values || filter.values.length <= 0) {
                continue;
            }

            for (const value of filter.values) {
                obJCache.set(this.HRD_IDS[filter.id.replace('hrt_', '')] + '_' + value, undefined);
            }
        }

        return obJCache;
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
            .replace(new RegExp('year', 'g'), '')
            .replace(new RegExp('month', 'g'), 'Monat')
            .replace(new RegExp('week', 'g'), 'Woche');
        res.push(this.valueToHumanReadableText(when, 'hrt_when', undefined, true));
        const what = (sdocSearchForm.what ? sdocSearchForm.what : '').replace(new RegExp('kw_', 'gi'), '');
        res.push(this.valueToHumanReadableText(what, 'hrt_keyword', undefined, true));

        const moreFilterValues = this.searchParameterUtils.splitValuesByPrefixes(sdocSearchForm.moreFilter, this.splitter,
            Object.getOwnPropertyNames(this.HRD_IDS));
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
        res.push(this.valueToHumanReadableText(sdocSearchForm.personalRateOverall, 'hrt_personalRateOverall', undefined, true));
        res.push(this.valueToHumanReadableText(sdocSearchForm.personalRateDifficulty, 'hrt_personalRateDifficulty', undefined, true));
        res.push(this.valueToHumanReadableText(sdocSearchForm.persons, 'hrt_persons', undefined, true));
        res.push(this.valueToHumanReadableText(sdocSearchForm.playlists, 'hrt_playlists', undefined, true));

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
                if (safeValue) {
                    res.values.push((translate ? this.translateService.instant(safeValue) || safeValue : safeValue));
                }
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
