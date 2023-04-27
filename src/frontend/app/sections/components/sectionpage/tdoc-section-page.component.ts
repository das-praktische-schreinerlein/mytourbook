import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TourDocSearchFormConverter} from '../../../shared-tdoc/services/tdoc-searchform-converter.service';
import {LayoutService, LayoutSizeData} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {StaticPagesDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/staticpages-data.service';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {TourDocSearchForm, TourDocSearchFormFactory} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {Facet, Facets} from '@dps/mycms-commons/dist/search-commons/model/container/facets';
import {AngularMarkdownService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-markdown.service';
import {AngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-html.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {GenericTrackingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/generic-tracking.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {environment} from '../../../../environments/environment';
import {
    SectionPageComponent
} from '@dps/mycms-frontend-commons/dist/frontend-section-commons/components/sectionpage/section-page.component';
import {TranslateService} from '@ngx-translate/core';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';

export interface TourDocSectionPageComponentAvailableTabs {
    DESTINATION?: boolean;
    IMAGE?: boolean;
    INFO?: boolean;
    ODIMGOBJECT?: boolean;
    VIDEO?: boolean;
    LOCATION?: boolean;
    NEWS?: boolean;
    PLAYLIST?: boolean;
    ROUTE?: boolean;
    TRACK?: boolean;
    TRIP?: boolean;
    POI?: boolean;
    ALL?: boolean;
}

export interface TourDocSectionPageComponentDashboardRows {
    noSubType?: boolean;
    unrated?: boolean;
    objectDetectionCorrectionNeeded?: boolean;
    objectDetectionDetailNeeded?: boolean;
    objectDetectionSuggested?: boolean;
    objectDetectionError?: boolean;
    objectDetectionOpen?: boolean;
    rated?: boolean;
    objectDetectionDone?: boolean;
}

@Component({
    selector: 'app-tdoc-sectionpage',
    templateUrl: './tdoc-section-page.component.html',
    styleUrls: ['./tdoc-section-page.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocSectionPageComponent extends SectionPageComponent {
    objectKeys = Object.keys;
    tdocSearchForm: TourDocSearchForm = new TourDocSearchForm({});
    tdocSearchResult: TourDocSearchResult = new TourDocSearchResult(this.tdocSearchForm, 0, undefined, new Facets());
    routeSearchResult: TourDocSearchResult = new TourDocSearchResult(this.tdocSearchForm, 0, undefined, new Facets());
    statistics: {} = [];
    pageContainerOrder = [];
    bestMatchingTabsOrder = [];
    favoritesTabsOrder = [];
    availableTabs: TourDocSectionPageComponentAvailableTabs = {
        DESTINATION: true,
        IMAGE: true,
        INFO: true,
        PLAYLIST: true,
        ROUTE: true,
        TRACK: true,
        LOCATION: true,
        TRIP: true,
        VIDEO: true,
        POI: true,
        ALL: true
    };
    availableDashboardColumns: TourDocSectionPageComponentAvailableTabs = {
        ODIMGOBJECT: true,
        IMAGE: true,
        VIDEO: true,
        TRACK: true,
        ROUTE: true,
        LOCATION: true,
        TRIP: true,
        NEWS: true,
        INFO: true,
        POI: true
    };

    availableToDoDashboardRows: TourDocSectionPageComponentDashboardRows = {
    };
    availableDoneDashboardRows: TourDocSectionPageComponentDashboardRows = {
    };

    private layoutSize: LayoutSizeData;
    private DEFAULT_PAGECONTAINERORDER = [
        'contentContainer',
        'searchHintContainer',
        'newsContainer',
        'sectionsContainer',
        'topTenContainer',
        'dashBoardContainer',
        'adminAreaContainer',
        'tagcloudContainer',
        'statisticBoardContainer'];
    private DEFAULT_BESTMATCHINGTABORDER = [
        'ROUTE',
        'DESTINATION',
        'LOCATION',
        'IMAGE',
        'TRACK',
        'TRIP',
        'VIDEO',
        'INFO',
        'PLAYLIST',
        'POI',
        'ALL'];
    private DEFAULT_FAVORITESTABORDER = [
        'IMAGE',
        'ROUTE',
        'DESTINATION',
        'TRACK',
        'VIDEO',
        'ALL'];

    constructor(route: ActivatedRoute, pagesDataService: StaticPagesDataService, private cdocDataService: TourDocDataService,
                commonRoutingService: CommonRoutingService, private searchFormConverter: TourDocSearchFormConverter,
                errorResolver: ErrorResolver, private tdocRoutingService: CommonDocRoutingService,
                toastr: ToastrService, pageUtils: PageUtils,
                angularMarkdownService: AngularMarkdownService, angularHtmlService: AngularHtmlService,
                cd: ChangeDetectorRef, trackingProvider: GenericTrackingService, platformService: PlatformService,
                layoutService: LayoutService, appService: GenericAppService, private translateService: TranslateService) {
        super(route, pagesDataService, commonRoutingService, errorResolver, toastr,
            pageUtils, angularMarkdownService, angularHtmlService, cd, trackingProvider, platformService,
            layoutService, appService);
    }

    getFiltersForType(recordType: string, sort?: string): any {
        const filters = {
            type: recordType
        };

        filters['theme'] = this.pdoc.theme;
        if (recordType === 'IMAGE') {
            filters['perPage'] = 6;
            if (this.layoutSize && this.layoutSize.width > 1300 && this.layoutSize.width < 1400) {
                filters['perPage'] = 5;
            }
        } else {
            filters['perPage'] = 6;
            if (this.layoutSize && this.layoutSize.width > 1300 && this.layoutSize.width < 1400) {
                filters['perPage'] = 5;
            }
        }

        if (sort) {
            filters['sort'] = sort;
            if (sort === 'ratePers') {
                filters['moreFilter'] = 'personalRateOverall:8,9,10,11,12,13,14,15';
            }
        }

        if (recordType === 'NEWS') {
            filters['perPage'] = 2;
            return filters;
        }

        filters['when'] = this.tdocSearchForm.when.toString();  // stringify array
        filters['where'] = this.searchFormConverter.joinWhereParams(this.tdocSearchForm);
        filters['what'] = this.searchFormConverter.joinWhatParams(this.tdocSearchForm);
        filters['nearBy'] = this.tdocSearchForm.nearby;
        filters['nearbyAddress'] = this.tdocSearchForm.nearbyAddress;
        filters['fulltext'] = this.tdocSearchForm.fulltext;

        return filters;
    }

    getDashboardFiltersForType(profile: string, recordType: string, sort?: string): any {
        const filters = this.getFiltersForType(recordType, sort);
        const splitter = this.searchFormConverter.splitter;
        switch (profile) {
            // dashboard
            case 'doublettes':
            case 'conflictingRates':
            case 'noFavoriteChildren':
            case 'noMainFavoriteChildren':
            case 'noCoordinates':
            case 'noLocation':
            case 'noRoute':
            case 'noSubType':
            case 'todoDesc':
            case 'todoKeywords':
            case 'unrated':
            case 'unRatedChildren':
                filters['dashboardFilter'] = filters['dashboardFilter'] ? filters['dashboardFilter'] + splitter : '';
                filters['dashboardFilter'] += profile;
                break;
            // Others
            case 'rated':
                filters['moreFilter'] = filters['moreFilter'] ? filters['moreFilter'] + splitter : '';
                filters['moreFilter'] += 'personalRateOverall:1,2,3,4,5,6,7,8,9,10,11,12,13,14,15';
                break;
            case 'rejected':
                filters['moreFilter'] = filters['moreFilter'] ? filters['moreFilter'] + splitter : '';
                filters['moreFilter'] += 'personalRateOverall:-1';
                break;
            case 'objectDetectionOpen':
                filters['moreFilter'] = filters['moreFilter'] ? filters['moreFilter'] + splitter : '';
                filters['moreFilter'] += 'objectDetectionState:OPEN';
                break;
            case 'objectDetectionToDo':
                filters['moreFilter'] = filters['moreFilter'] ? filters['moreFilter'] + splitter : '';
                filters['moreFilter'] += 'objectDetectionState:RUNNING_MANUAL_CORRECTION_NEEDED,RUNNING_MANUAL_DETAIL_NEEDED,' +
                    'RUNNING_SUGGESTED' + splitter + 'personalRateOverall:1,2,3,4,5,6,7,8,9,10,11,12,13,14,15';
                break;
            case 'objectDetectionDetailNeeded':
                filters['moreFilter'] = filters['moreFilter'] ? filters['moreFilter'] + splitter : '';
                filters['moreFilter'] += 'objectDetectionState:RUNNING_MANUAL_DETAIL_NEEDED';
                break;
            case 'objectDetectionCorrectionNeeded':
                filters['moreFilter'] = filters['moreFilter'] ? filters['moreFilter'] + splitter : '';
                filters['moreFilter'] += 'objectDetectionState:RUNNING_MANUAL_CORRECTION_NEEDED';
                break;
            case 'objectDetectionSuggested':
                filters['moreFilter'] = filters['moreFilter'] ? filters['moreFilter'] + splitter : '';
                filters['moreFilter'] += 'objectDetectionState:RUNNING_SUGGESTED' +
                    splitter + 'personalRateOverall:1,2,3,4,5,6,7,8,9,10,11,12,13,14,15';
                break;
            case 'objectDetectionError':
                filters['moreFilter'] = filters['moreFilter'] ? filters['moreFilter'] + splitter : '';
                filters['moreFilter'] += 'objectDetectionState:ERROR';
                break;
            case 'objectDetectionDone':
                filters['moreFilter'] = filters['moreFilter'] ? filters['moreFilter'] + splitter : '';
                filters['moreFilter'] += 'objectDetectionState:RUNNING_NO_SUGGESTION,' +
                    'RUNNING_MANUAL_APPROVED,RUNNING_MANUAL_REJECTED,RUNNING_MANUAL_DETAILED,' +
                    'DONE_APPROVAL_PROCESSED,DONE_REJECTION_PROCESSED,DONE_CORRECTION_PROCESSED,DONE_DETAIL_PROCESSED';
                break;
        }

        return filters;
    }

    getDashboardVisibilityForType(profile: string, recordType: string): boolean {
        switch (profile) {
            case 'noSubType':
                return recordType !== 'ODIMGOBJECT' && recordType !== 'IMAGE' && recordType !== 'VIDEO' && recordType !== 'TRIP'
                    && recordType !== 'NEWS';
            case 'noLocation':
                return recordType === 'TRACK' || recordType === 'ROUTE' || recordType === 'TRIP' || recordType === 'LOCATION'
                    || recordType === 'INFO' || recordType === 'POI';
            case 'noRoute':
                return recordType === 'TRACK';
            case 'unrated':
                return recordType !== 'ODIMGOBJECT' && recordType !== 'LOCATION' && recordType !== 'TRIP' && recordType !== 'NEWS'
                    && recordType !== 'INFO' && recordType !== 'POI';
            case 'todoKeywords':
                return recordType !== 'ODIMGOBJECT' && recordType !== 'IMAGE' && recordType !== 'VIDEO' && recordType !== 'LOCATION'
                    && recordType !== 'TRIP' && recordType !== 'NEWS' && recordType !== 'POI';
            case 'todoDesc':
                return recordType !== 'ODIMGOBJECT' && recordType !== 'IMAGE' && recordType !== 'VIDEO' && recordType !== 'POI';
            case 'doublettes':
                return recordType !== 'ODIMGOBJECT';
            case 'conflictingRates':
                return recordType === 'TRACK' || recordType === 'NEWS' || recordType === 'TRIP';
            case 'noFavoriteChildren':
                return recordType === 'TRACK';
            case 'unRatedChildren':
                return recordType === 'TRACK' || recordType === 'NEWS' || recordType === 'TRIP';
            case 'noMainFavoriteChildren':
                return recordType === 'TRACK' || recordType === 'ROUTE' || recordType === 'NEWS' || recordType === 'TRIP';
            case 'noCoordinates':
                return recordType === 'LOCATION';
            case 'objectDetectionCorrectionNeeded':
                return recordType === 'ODIMGOBJECT' || recordType === 'IMAGE';
            case 'objectDetectionDetailNeeded':
                return recordType === 'ODIMGOBJECT' || recordType === 'IMAGE';
            case 'objectDetectionSuggested':
                return recordType === 'ODIMGOBJECT' || recordType === 'IMAGE';
            case 'objectDetectionError':
                return recordType === 'ODIMGOBJECT' || recordType === 'IMAGE';
            case 'objectDetectionOpen':
                return recordType === 'ODIMGOBJECT' || recordType === 'IMAGE';
            case 'rated':
                return recordType !== 'ODIMGOBJECT' && recordType !== 'LOCATION' && recordType !== 'TRIP' && recordType !== 'NEWS'
                    && recordType !== 'INFO' && recordType !== 'POI';
            case 'rejected':
                return recordType !== 'ODIMGOBJECT' && recordType !== 'LOCATION' && recordType !== 'TRIP' && recordType !== 'NEWS'
                    && recordType !== 'INFO' && recordType !== 'POI';
            case 'objectDetectionDone':
                return recordType === 'ODIMGOBJECT' || recordType === 'IMAGE';
        }

        return false;
    }

    onSearchDoc(tdocSearchForm: TourDocSearchForm) {
        this.tdocSearchForm = tdocSearchForm;
        this.tdocRoutingService.setLastSearchUrl(this.getToSearchUrl());
        this.cd.markForCheck();

        return false;
    }

    onTopTenResultFound(tdocSearchResult: TourDocSearchResult) {
        if (tdocSearchResult !== undefined && tdocSearchResult.searchForm !== undefined) {
            this.tdocSearchResult = tdocSearchResult;
        }
        this.cd.markForCheck();

        return false;
    }

    onTopTenRouteResultFound(tdocSearchResult: TourDocSearchResult) {
        this.routeSearchResult = tdocSearchResult;
        this.onTopTenResultFound(tdocSearchResult);
    }

    onTopTenDestinationResultFound(tdocSearchResult: TourDocSearchResult) {
        this.onTopTenResultFound(tdocSearchResult);
    }

    doStatisticSearch(type: string): Promise<TourDocSearchResult> {
        const me = this;
        const searchForm = this.cdocDataService.newSearchForm({ type: type});
        return this.cdocDataService.search(searchForm, {
            loadDetailsMode: '',
            showFacets: [ 'statistics' ],
            loadTrack: false,
            showForm: false
        }).then(function doneSearch(cdocSearchResult) {
            if (cdocSearchResult === undefined) {
                me.statistics[type] = {};
            } else {
                if (cdocSearchResult && cdocSearchResult.facets && cdocSearchResult.facets.facets.get('statistics')) {
                    me.statistics[type] = me.mapFacetStatistics(cdocSearchResult.facets.facets.get('statistics'));
                } else {
                    me.statistics[type] = {};
                }
            }

            me.cd.markForCheck();

            return Promise.resolve(cdocSearchResult);
        }).catch(function errorSearch(reason) {
            me.toastr.error('Es gibt leider Probleme bei der Statistik-Suche - am besten noch einmal probieren :-(', 'Oje!');
            console.error('doSearch statistics failed:', reason);

            me.statistics[type] = {};
            me.cd.markForCheck();

            return Promise.reject(reason);
        });
    }

    mapFacetStatistics(facet: Facet): {} {
        const statistics = {};
        const types = {};
        const actions = {};
        const years = {};
        if (facet) {
            facet.facet.forEach(value => {
                const key = value[0];
                const count = value[1];
                const data = key.split('-');
                if (data.length === 3) {
                    if (!types[data[0]]) {
                        types[data[0]] = {};
                    }

                    if (!types[data[0]][data[1]]) {
                        types[data[0]][data[1]] = {};
                    }

                    types[data[0]][data[1]][data[2]] = count;
                    actions[data[1]] = data[1];
                    years[data[2]] = data[2];
                }
            })
        }

        for (const keyType of Object.keys(types).sort()) {
            statistics[keyType] = [];

            const yearValues = {};
            const headerValue = ['', '']
            for (const year of Object.keys(years).sort()) {
                yearValues[year] = 0;
                headerValue.push(year);
            }
            statistics[keyType].push(headerValue);

            for (const action of Object.keys(actions).sort()) {
                if (!types[keyType][action]) {
                    continue;
                }

                const actionValues = [action, this.translateService.instant(action)]
                for (const year of Object.keys(years).sort()) {
                    if (!types[keyType][action][year]) {
                        actionValues.push(undefined);
                        continue;
                    }

                    if (action.startsWith('ac_')) {
                        yearValues[year] += types[keyType][action][year]
                    }

                    actionValues.push(types[keyType][action][year]);
                }

                statistics[keyType].push(actionValues);
            }

            statistics[keyType].sort((a, b) => {
                return a[1].localeCompare(b[1]);
            })

            const yearRow = [undefined, undefined];
            for (const year of Object.keys(years).sort()) {
                yearRow.push(yearValues[year]);
            }
            statistics[keyType].push(yearRow);

        }

        return statistics;
    }

    onTagcloudClicked(filterValue: any, filter: string) {
        this.tdocSearchForm.type = 'route';
        this.tdocSearchForm[filter] = filterValue;
        const url = this.searchFormConverter.searchFormToUrl(this.baseSearchUrl, TourDocSearchFormFactory.createSanitized({
            theme: this.pdoc.theme,
            perPage: 10,
            type: 'route',
            actiontype: this.tdocSearchForm.actiontype.toString(),
            when: this.tdocSearchForm.when.toString(),
            what: this.tdocSearchForm.what.toString(),
            where: this.tdocSearchForm.where.toString(),
            nearBy: this.tdocSearchForm.nearby,
            personalRateDifficulty: this.tdocSearchForm.personalRateDifficulty,
            techRateOverall: this.tdocSearchForm.techRateOverall,
            techDataDuration: this.tdocSearchForm.techDataDuration,
            techDataDistance: this.tdocSearchForm.techDataDistance,
            techDataAltitudeMax: this.tdocSearchForm.techDataAltitudeMax,
            techDataAscent: this.tdocSearchForm.techDataAscent,
            techDataSections: this.tdocSearchForm.techDataSections,
            nearbyAddress: this.tdocSearchForm.nearbyAddress,
            fulltext: this.tdocSearchForm.fulltext
        }));
        this.commonRoutingService.navigateByUrl(url);

        return false;
    }

    onStatisticClicked(statisticSearchForm: any, statisticBoardData: {}, action: string, columnIndex: number) {
        if (!statisticSearchForm) {
            return false;
        }

        let when = undefined;
        if (columnIndex) {
          if (statisticBoardData[0][columnIndex] === 'ALLOVER') {
              when = 'doneDONE1';
          } else {
              when = 'year' + statisticBoardData[0][columnIndex].toString();
          }
        }

        const url = this.searchFormConverter.searchFormToUrl('/sections/start/', TourDocSearchFormFactory.createSanitized({
            ...statisticSearchForm,
            perPage: 10,
            techDataAltitudeMax: action && action.startsWith('ele_')
                ? '' + Number(action.replace(/[^0-9]/gs, ''))
                : undefined,
            actiontype: action && action !== 'ac_undefined' && action.startsWith('ac_')
                ? action.toString()
                : undefined,
            when: when,
        }));
        this.commonRoutingService.navigateByUrl(url);

        return false;
    }

    getToSearchUrl() {
        return this.searchFormConverter.searchFormToUrl(this.baseSearchUrl, TourDocSearchFormFactory.createSanitized({
            theme: this.pdoc.theme,
            perPage: 10,
            type: environment.defaultSearchTypes,
            actiontype: this.tdocSearchForm.actiontype.toString(),
            when: this.tdocSearchForm.when.toString(),
            what: this.tdocSearchForm.what.toString(),
            where: this.tdocSearchForm.where.toString(),
            nearBy: this.tdocSearchForm.nearby,
            nearbyAddress: this.tdocSearchForm.nearbyAddress
        }));
    }

    submitToSearch() {
        const url = this.getToSearchUrl();
        // console.log('submitToSearch: redirect to ', url);

        this.commonRoutingService.navigateByUrl(url);
        return false;
    }

    protected onResize(layoutSizeData: LayoutSizeData): void {
        super.onResize(layoutSizeData);
        this.layoutSize = layoutSizeData;
        this.cd.markForCheck();
    }

    protected configureProcessingOfResolvedData(config: {}): void {
        if (BeanUtils.getValue(config, 'components.pdoc-sectionpage.availableTabs') !== undefined) {
            this.availableTabs = BeanUtils.getValue(config, 'components.pdoc-sectionpage.availableTabs');
        }

        if (BeanUtils.getValue(config, 'permissions.tdocWritable') === true) {
            if (BeanUtils.getValue(config, 'components.pdoc-sectionpage.availableDashboardColumns') !== undefined) {
                this.availableDashboardColumns = BeanUtils.getValue(config, 'components.pdoc-sectionpage.availableDashboardColumns');
            }
            if (BeanUtils.getValue(config, 'components.pdoc-sectionpage.availableToDoDashboardRows') !== undefined) {
                this.availableToDoDashboardRows = BeanUtils.getValue(config, 'components.pdoc-sectionpage.availableToDoDashboardRows');
            }
            if (BeanUtils.getValue(config, 'components.pdoc-sectionpage.availableDoneDashboardRows') !== undefined) {
                this.availableDoneDashboardRows = BeanUtils.getValue(config, 'components.pdoc-sectionpage.availableDoneDashboardRows');
            }
        }
    }

    protected doProcessAfterResolvedData(config: {}): void {
        this.tdocRoutingService.setLastBaseUrl(this.baseSearchUrl);
        this.tdocRoutingService.setLastSearchUrl(this.getToSearchUrl());

        if (this.pdoc.flags && this.pdoc.flags.toString().includes('flgShowStatisticBoard')) {
            this.doStatisticSearch('ROUTE');
            this.doStatisticSearch('DESTINATION');
            this.doStatisticSearch('TRACK');
        }

        if (this.pdoc['pageContainerOrder']) {
            this.pageContainerOrder = this.pdoc['pageContainerOrder'];
        } else if (BeanUtils.getValue(config, 'components.pdoc-sectionpage.pageContainerOrder') !== undefined) {
            this.pageContainerOrder = BeanUtils.getValue(config, 'components.pdoc-sectionpage.pageContainerOrder');
        } else {
            this.pageContainerOrder = this.DEFAULT_PAGECONTAINERORDER;
        }

        let list = [];
        if (this.pdoc['bestMatchingTabsOrder']) {
            list = this.pdoc['bestMatchingTabsOrder'];
        } else if (BeanUtils.getValue(config, 'components.pdoc-sectionpage.bestMatchingTabsOrder') !== undefined) {
            list = BeanUtils.getValue(config, 'components.pdoc-sectionpage.bestMatchingTabsOrder');
        } else {
            list = this.DEFAULT_BESTMATCHINGTABORDER;
        }

        this.bestMatchingTabsOrder =  list.filter(tab => this.availableTabs[tab]);

        list = [];
        if (this.pdoc['favoritesTabsOrder']) {
            list = this.pdoc['favoritesTabsOrder'];
        } else if (BeanUtils.getValue(config, 'components.pdoc-sectionpage.favoritesTabsOrder') !== undefined) {
            list = BeanUtils.getValue(config, 'components.pdoc-sectionpage.favoritesTabsOrder');
        } else {
            list = this.DEFAULT_FAVORITESTABORDER;
        }

        this.favoritesTabsOrder =  list.filter(tab => this.availableTabs[tab]);
    }

}
