import {Injectable} from '@angular/core';
import {TourDocSearchForm, TourDocSearchFormValidator} from '../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {
    GenericSearchFormSearchFormConverter,
    HumanReadableFilter
} from '@dps/mycms-commons/dist/search-commons/services/generic-searchform.converter';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {TranslateService} from '@ngx-translate/core';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {Layout} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';

@Injectable()
export class TourDocSearchFormConverter implements GenericSearchFormSearchFormConverter<TourDocSearchForm> {
    public readonly splitter = '_,_';
    public HRD_IDS = {
        track_id_i: 'TRACK',
        track_id_is: 'TRACK',
        trip_id_i: 'TRIP',
        trip_id_is: 'TRIP',
        news_id_i: 'NEWS',
        news_id_is: 'NEWS',
        info_id_i: 'INFO',
        info_id_is: 'INFO',
        loc_id_i: 'LOCATION',
        loc_lochirarchie_ids_txt: 'LOCATION',
        image_id_i: 'IMAGE',
        video_id_i: 'VIDEO',
        route_id_i: 'ROUTE',
        route_id_is: 'ROUTE',
        destination_id_s: 'DESTINATION',
        destination_id_ss: 'DESTINATION',
        loc_parent_id_i: 'LOCATION'};

    public static layoutToString(layout: Layout): string {
        if (layout === undefined) {
            return undefined;
        }

        switch (layout) {
            case Layout.THIN:
                return 'THIN';
            case Layout.FLAT:
                return 'FLAT';
            case Layout.SMALL:
                return 'SMALL';
            case Layout.BIG:
                return 'BIG';
            case Layout.PAGE:
                return 'PAGE';
        }

        return undefined;
    }

    // TODO move to commons
    public static layoutFromString(layout: string): Layout {
        if (!layout) {
            return undefined;
        }

        switch (layout) {
            case 'THIN':
                return Layout.THIN;
            case 'FLAT':
                return Layout.FLAT;
            case 'SMALL':
                return Layout.SMALL;
            case 'BIG':
                return Layout.BIG;
            case 'PAGE':
                return Layout.PAGE;
        }

        return undefined;
    }

    constructor(private searchParameterUtils: SearchParameterUtils, private translateService: TranslateService,
                private searchFormUtils: SearchFormUtils) {
    }

    isValid(searchForm: TourDocSearchForm): boolean {
        return TourDocSearchFormValidator.isValid(searchForm);
    }

    newSearchForm(values: {}): TourDocSearchForm {
        return new TourDocSearchForm(values);
    }

    parseLayoutParams(values: {}, tdocSearchForm: TourDocSearchForm): Layout {
        if (!values || !values['layout']) {
            return undefined;
        }

        return TourDocSearchFormConverter.layoutFromString(values['layout']);
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
        moreFilterMap.set('techDataSections', searchForm.techDataSections);
        moreFilterMap.set('techRateOverall', searchForm.techRateOverall);
        moreFilterMap.set('personalRateDifficulty', searchForm.personalRateDifficulty);
        moreFilterMap.set('personalRateOverall', searchForm.personalRateOverall);
        moreFilterMap.set('objectDetectionCategory', searchForm.objectDetectionCategory);
        moreFilterMap.set('objectDetectionDetector', searchForm.objectDetectionDetector);
        moreFilterMap.set('objectDetectionKey', searchForm.objectDetectionKey);
        moreFilterMap.set('objectDetectionPrecision', searchForm.objectDetectionPrecision);
        moreFilterMap.set('objectDetectionState', searchForm.objectDetectionState);
        moreFilterMap.set('routeAttr', searchForm.routeAttr);
        moreFilterMap.set('routeAttrPart', searchForm.routeAttrPart);
        moreFilterMap.set('gpsTrackState', searchForm.gpsTrackState);
        moreFilterMap.set('dashboardFilter', searchForm.dashboardFilter);
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
        whatMap.set('objects', searchForm.objects);
        whatMap.set('playlists', searchForm.playlists);
        whatMap.set('initial', searchForm.initial);
        return this.searchParameterUtils.joinParamsToOneRouteParameter(whatMap, this.splitter);
    }

    searchFormToValueMap(tdocSearchForm: TourDocSearchForm): {[key: string]: string } {
        const searchForm = (tdocSearchForm ? tdocSearchForm : new TourDocSearchForm({}));

        const where = this.joinWhereParams(searchForm);
        const moreFilter = this.joinMoreFilterParams(searchForm);
        const what = this.joinWhatParams(searchForm);

        const params: {[key: string]: string } = {
            when: this.searchParameterUtils.joinAndUseValueOrDefault(searchForm.when, 'jederzeit'),
            where: this.searchParameterUtils.joinAndUseValueOrDefault(where, 'ueberall'),
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

    searchFormToUrl(baseUrl: string, tdocSearchForm: TourDocSearchForm): string {
        let url = baseUrl + 'search/';
        const searchForm = (tdocSearchForm ? tdocSearchForm : new TourDocSearchForm({}));

        const where = this.joinWhereParams(searchForm);
        const moreFilter = this.joinMoreFilterParams(searchForm);
        const what = this.joinWhatParams(searchForm);

        const params: Object[] = [
            this.searchParameterUtils.joinAndUseValueOrDefault(searchForm.when, 'jederzeit'),
            this.searchParameterUtils.joinAndUseValueOrDefault(where, 'ueberall'),
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
            queryParameter.push('layout=' + TourDocSearchFormConverter.layoutToString(searchForm['layout']));
        }

        if (searchForm['hideForm']) {
            queryParameter.push('hideForm=true');
        }

        if (queryParameter.length > 0) {
            url += '?' + queryParameter.join('&');
        }

        return url;
    }

    paramsToSearchForm(params: any, defaults: {}, searchForm: TourDocSearchForm, queryParams?: {}): void {
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
            ['techDataAltitudeMax:', 'techDataAscent:', 'techDataDistance:', 'techDataDuration:', 'techDataSections:',
                'techRateOverall:', 'personalRateOverall:', 'personalRateDifficulty:',
                'objectDetectionCategory:', 'objectDetectionDetector:', 'objectDetectionKey:', 'objectDetectionPrecision:',
                'objectDetectionState:', 'routeAttr:', 'routeAttrPart:', 'dashboardFilter:', 'gpsTrackState:']);
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
        const techDataSections: string = (moreFilterValues.has('techDataSections:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get('techDataSections:'), 'techDataSections:', ',') : '');
        const techRateOverall: string = (moreFilterValues.has('techRateOverall:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get('techRateOverall:'), 'techRateOverall:', ',') : '');
        const personalRateOverall: string = (moreFilterValues.has('personalRateOverall:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get('personalRateOverall:'), 'personalRateOverall:',
                ',') : '');
        const personalRateDifficulty: string = (moreFilterValues.has('personalRateDifficulty:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get('personalRateDifficulty:'), 'personalRateDifficulty:',
                ',') : '');
        const objectDetectionCategory: string = (moreFilterValues.has('objectDetectionCategory:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get('objectDetectionCategory:'), 'objectDetectionCategory:',
                ',') : '');
        const objectDetectionDetector: string = (moreFilterValues.has('objectDetectionDetector:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get('objectDetectionDetector:'), 'objectDetectionDetector:',
                ',') : '');
        const objectDetectionKey: string = (moreFilterValues.has('objectDetectionKey:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get('objectDetectionKey:'), 'objectDetectionKey:',
                ',') : '');
        const objectDetectionPrecision: string = (moreFilterValues.has('objectDetectionPrecision:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get('objectDetectionPrecision:'), 'objectDetectionPrecision:',
                ',') : '');
        const objectDetectionState: string = (moreFilterValues.has('objectDetectionState:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get('objectDetectionState:'), 'objectDetectionState:',
                ',') : '');
        const routeAttr: string = (moreFilterValues.has('routeAttr:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get('routeAttr:'), 'routeAttr:',
                ',') : '');
        const routeAttrPart: string = (moreFilterValues.has('routeAttrPart:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get('routeAttrPart:'), 'routeAttrPart:',
                ',') : '');
        const gpsTrackState: string = (moreFilterValues.has('gpsTrackState:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get('gpsTrackState:'), 'gpsTrackState:',
                ',') : '');
        const dashboardFilter: string = (params.dashboardFilter
            ? params.dashboardFilter
            : ( moreFilterValues.has('dashboardFilter:') ?
                this.searchParameterUtils.joinValuesAndReplacePrefix(moreFilterValues.get('dashboardFilter:'), 'dashboardFilter:',
                    ',')
                : ''));

        const whatFilterValues = this.searchParameterUtils.splitValuesByPrefixes(params.what, this.splitter,
            ['action:', 'keyword:', 'playlists:', 'persons:', 'objects:', 'initial:']);
        const what: string = (whatFilterValues.has('keyword:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(whatFilterValues.get('keyword:'), 'keyword:', ',') : '');
        const actiontype: string = (whatFilterValues.has('action:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(whatFilterValues.get('action:'), 'action:', ',') : '');
        const playlists: string = (whatFilterValues.has('playlists:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(whatFilterValues.get('playlists:'), 'playlists:', ',') : '');
        const persons: string = (whatFilterValues.has('persons:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(whatFilterValues.get('persons:'), 'persons:', ',') : '');
        const objects: string = (whatFilterValues.has('objects:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(whatFilterValues.get('objects:'), 'objects:', ',') : '');
        const initial: string = (whatFilterValues.has('initial:') ?
            this.searchParameterUtils.joinValuesAndReplacePrefix(whatFilterValues.get('initial:'), 'initial:', ',') : '');

        searchForm.theme = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(params['theme'], /^alle$/, ''),
            defaults['theme'], '');
        searchForm.when = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(params['when'], /^jederzeit$/, ''),
            defaults['when'], '');
        searchForm.where = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(where, /^ueberall$/, ''),
            defaults['where'], '');
        searchForm.locId = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(locId, /^ueberall$/, ''),
            defaults['locId'], '');
        searchForm.nearby = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(nearby, /^ueberall$/, ''),
            defaults['nearby'], '');
        searchForm.nearbyAddress = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(nearbyAddress, /^ueberall$/, ''),
            defaults['nearbyAddress'], '');
        searchForm.what = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(what, /^alles$/, ''),
            defaults['what'], '');
        searchForm.actiontype = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(actiontype, /^alles$/, ''),
            defaults['actiontype'], '');
        searchForm.playlists = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(playlists, /^alles$/, ''),
            defaults['playlists'], '');
        searchForm.persons = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(persons, /^alles$/, ''),
            defaults['persons'], '');
        searchForm.objects = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(objects, /^alles$/, ''),
            defaults['objects'], '');
        searchForm.initial = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(initial, /^alles$/, ''),
            defaults['initial'], '');
        searchForm.fulltext = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(params['fulltext'], /^egal$/, ''),
            defaults['fulltext'], '');
        searchForm.moreFilter = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(moreFilter, /^ungefiltert$/, ''),
            defaults['moreFilter'], '');
        searchForm.techRateOverall = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(techRateOverall, /^ungefiltert$/, ''),
            defaults['techRateOverall'], '');
        searchForm.personalRateOverall = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(personalRateOverall, /^ungefiltert$/, ''),
            defaults['personalRateOverall'], '');
        searchForm.personalRateDifficulty = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(personalRateDifficulty, /^ungefiltert$/, ''),
            defaults['personalRateDifficulty'], '');
        searchForm.techDataAscent = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(techDataAscent, /^ungefiltert$/, ''),
            defaults['techDataAscent'], '');
        searchForm.techDataDuration = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(techDataDuration, /^ungefiltert$/, ''),
            defaults['techDataDuration'], '');
        searchForm.techDataSections = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(techDataSections, /^ungefiltert$/, ''),
            defaults['techDataSections'], '');
        searchForm.techDataDistance = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(techDataDistance, /^ungefiltert$/, ''),
            defaults['techDataDistance'], '');
        searchForm.techDataAltitudeMax = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(techDataAltitudeMax, /^ungefiltert$/, ''),
            defaults['techDataAltitudeMax'], '');
        searchForm.objectDetectionCategory = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(objectDetectionCategory, /^ungefiltert$/, ''),
            defaults['objectDetectionCategory'], '');
        searchForm.objectDetectionDetector = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(objectDetectionDetector, /^ungefiltert$/, ''),
            defaults['objectDetectionDetector'], '');
        searchForm.objectDetectionKey = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(objectDetectionKey, /^ungefiltert$/, ''),
            defaults['objectDetectionKey'], '');
        searchForm.objectDetectionPrecision = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(objectDetectionPrecision, /^ungefiltert$/, ''),
            defaults['objectDetectionPrecision'], '');
        searchForm.objectDetectionState = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(objectDetectionState, /^ungefiltert$/, ''),
            defaults['objectDetectionState'], '');
        searchForm.routeAttr = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(routeAttr, /^ungefiltert$/, ''),
            defaults['routeAttr'], '');
        searchForm.routeAttrPart = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(routeAttrPart, /^ungefiltert$/, ''),
            defaults['routeAttrPart'], '');
        searchForm.gpsTrackState = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(gpsTrackState, /^ungefiltert$/, ''),
            defaults['gpsTrackState'], '');

        searchForm.sort = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(params['sort'], defaults['sort'], '');
        searchForm.type = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(params['type'], /^alle$/, ''), defaults['type'], '').toLowerCase();
        searchForm.dashboardFilter = this.searchParameterUtils.joinAndUseValueDefaultOrFallback(
            this.searchParameterUtils.replacePlaceHolder(dashboardFilter, /^alles$/, ''),
            defaults['dashboardFilter'], '');
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

    searchFormToHumanReadableFilter(searchForm: TourDocSearchForm): HumanReadableFilter[] {
        const tdocSearchForm = (searchForm ? searchForm : new TourDocSearchForm({}));

        const res: HumanReadableFilter[] = [];
        res.push(this.translateService.instant('hrt_search') || 'search');
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.type, 'hrt_type', 'hrt_alltypes', true));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.where, 'hrt_in', undefined, true));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.nearbyAddress, 'hrt_nearby', undefined, true));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.actiontype, 'hrt_actiontype', undefined, true));

        const when = (tdocSearchForm.when ? tdocSearchForm.when : '')
            .replace(new RegExp('done', 'g'), '')
            .replace(new RegExp('year', 'g'), '')
            .replace(new RegExp('month', 'g'), 'Monat')
            .replace(new RegExp('week', 'g'), 'Woche');
        res.push(this.searchFormUtils.valueToHumanReadableText(when, 'hrt_when', undefined, true));
        const what = (tdocSearchForm.what ? tdocSearchForm.what : '').replace(new RegExp('kw_', 'gi'), '');
        res.push(this.searchFormUtils.valueToHumanReadableText(what, 'hrt_keyword', undefined, true));

        const moreFilterNames = Object.getOwnPropertyNames(this.getHrdIds()).concat(['noRoute']);
        const moreFilterValues = this.searchParameterUtils.splitValuesByPrefixes(tdocSearchForm.moreFilter, this.splitter, moreFilterNames);
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
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.techDataSections, 'hrt_techDataSections', undefined, true));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.techRateOverall, 'hrt_techRateOverall', undefined, true));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.personalRateOverall, 'hrt_personalRateOverall',
            undefined, true, 'filter.tdocratepers.gesamt.'));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.personalRateDifficulty, 'hrt_personalRateDifficulty',
            undefined, true, 'label.tdocratepers.schwierigkeit.'));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.personalRateDifficulty, 'hrt_personalRateDifficulty',
            undefined, true, 'label.tdocratepers.schwierigkeit.'));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.objectDetectionCategory, 'hrt_objectDetectionCategory',
            undefined, true, ''));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.objectDetectionDetector, 'hrt_objectDetectionDetector',
            undefined, true, ''));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.objectDetectionKey, 'hrt_objectDetectionKey',
            undefined, true, ''));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.objectDetectionPrecision, 'hrt_objectDetectionPrecision',
            undefined, true, ''));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.objectDetectionState, 'hrt_objectDetectionState',
            undefined, true, 'label.odimgobject.state.'));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.routeAttr, 'hrt_routeAttr',
            undefined, true, ''));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.routeAttrPart, 'hrt_routeAttrPart',
            undefined, true, ''));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.gpsTrackState, 'hrt_gpsTrackState', undefined, true, 'label.gpstrack.state.'));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.initial, 'hrt_initial', undefined, true));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.playlists, 'hrt_playlists', undefined, true));
        res.push(this.searchFormUtils.valueToHumanReadableText(tdocSearchForm.dashboardFilter, 'hrt_dashboardFilter',
            undefined, true, 'label.dashboardColumn.'));

        return res;
    }

    getHrdIds(): {} {
        return this.HRD_IDS;
    }

}
