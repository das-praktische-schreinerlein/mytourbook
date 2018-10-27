import {Injectable} from '@angular/core';
import {TourDocSearchForm, TourDocSearchFormValidator} from '../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {
    GenericSearchFormSearchFormConverter,
    HumanReadableFilter
} from '@dps/mycms-commons/dist/search-commons/services/generic-searchform.converter';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {TranslateService} from '@ngx-translate/core';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';

@Injectable()
export class TourDocSearchFormConverter implements GenericSearchFormSearchFormConverter<TourDocSearchForm> {
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
    constructor(private searchParameterUtils: SearchParameterUtils, private translateService: TranslateService,
                private searchFormUtils: SearchFormUtils) {
    }

    isValid(searchForm: TourDocSearchForm): boolean {
        return TourDocSearchFormValidator.isValid(searchForm);
    }

    newSearchForm(values: {}): TourDocSearchForm {
        return new TourDocSearchForm(values);
    }

    joinWhereParams(tdocSearchForm: TourDocSearchForm): string {
        const searchForm = (tdocSearchForm ? tdocSearchForm : new TourDocSearchForm({}));
        const whereMap = new Map();
        whereMap.set('locId', searchForm.locId);
        whereMap.set('loc', searchForm.where);
        whereMap.set('nearby', searchForm.nearby);
        whereMap.set('nearbyAddress', searchForm.nearbyAddress);
        return this.searchParameterUtils.joinParamsToOneRouteParameter(whereMap, this.splitter);
    }

    joinMoreFilterParams(tdocSearchForm: TourDocSearchForm): string {
        const searchForm = (tdocSearchForm ? tdocSearchForm : new TourDocSearchForm({}));
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

    joinWhatParams(tdocSearchForm: TourDocSearchForm): string {
        const searchForm = (tdocSearchForm ? tdocSearchForm : new TourDocSearchForm({}));
        const whatMap = new Map();
        whatMap.set('keyword', searchForm.what);
        whatMap.set('action', searchForm.actiontype);
        whatMap.set('persons', searchForm.persons);
        whatMap.set('playlists', searchForm.playlists);
        return this.searchParameterUtils.joinParamsToOneRouteParameter(whatMap, this.splitter);
    }

    searchFormToUrl(baseUrl: string, tdocSearchForm: TourDocSearchForm): string {
        let url = baseUrl + 'search/';
        const searchForm = (tdocSearchForm ? tdocSearchForm : new TourDocSearchForm({}));

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

    paramsToSearchForm(params: any, defaults: {}, searchForm: TourDocSearchForm): void {
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
        return this.searchFormUtils.searchFormToHumanReadableMarkup(filters, true, obJCache, this.getHrdIds());
    }

    searchFormToHumanReadableFilter(tdocSearchForm: TourDocSearchForm): HumanReadableFilter[] {
        const searchForm = (tdocSearchForm ? tdocSearchForm : new TourDocSearchForm({}));

        const res: HumanReadableFilter[] = [];
        res.push(this.translateService.instant('hrt_search') || 'search');
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.type, 'hrt_type', 'hrt_alltypes', true));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.where, 'hrt_in', undefined, true));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.nearbyAddress, 'hrt_nearby', undefined, true));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.actiontype, 'hrt_actiontype', undefined, true));

        const when = (tdocSearchForm.when ? tdocSearchForm.when : '')
            .replace(new RegExp('year', 'g'), '')
            .replace(new RegExp('month', 'g'), 'Monat')
            .replace(new RegExp('week', 'g'), 'Woche');
        res.push(this.searchFormUtils.valueToHumanReadableText(when, 'hrt_when', undefined, true));
        const what = (tdocSearchForm.what ? tdocSearchForm.what : '').replace(new RegExp('kw_', 'gi'), '');
        res.push(this.searchFormUtils.valueToHumanReadableText(what, 'hrt_keyword', undefined, true));

        const moreFilterValues = this.searchParameterUtils.splitValuesByPrefixes(tdocSearchForm.moreFilter, this.splitter,
            Object.getOwnPropertyNames(this.getHrdIds()));
        moreFilterValues.forEach((value, key) => {
            const moreValue = this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get(key), key + ':', ',');
            res.push(this.searchFormUtils.valueToHumanReadableText(moreValue, key === 'unknown' ? 'hrt_moreFilter' : 'hrt_' + key,
                undefined, true));
        });

        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.fulltext, 'hrt_fulltext', undefined, true));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.techDataAltitudeMax, 'hrt_techDataAltitudeMax',
            undefined, true));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.techDataAscent, 'hrt_techDataAscent', undefined, true));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.techDataDistance, 'hrt_techDataDistance', undefined, true));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.techDataDuration, 'hrt_techDataDuration', undefined, true));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.techRateOverall, 'hrt_techRateOverall', undefined, true));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.personalRateOverall, 'hrt_personalRateOverall',
            undefined, true));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.personalRateDifficulty, 'hrt_personalRateDifficulty',
            undefined, true));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.persons, 'hrt_persons', undefined, true));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.playlists, 'hrt_playlists', undefined, true));

        return res;
    }

    getHrdIds(): {} {
        return this.HRD_IDS;
    }

}