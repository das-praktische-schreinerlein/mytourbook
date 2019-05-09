import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PDocRecord} from '@dps/mycms-commons/dist/pdoc-commons/model/records/pdoc-record';
import {ToastrService} from 'ngx-toastr';
import {TourDocSearchFormConverter} from '../../../shared-tdoc/services/tdoc-searchform-converter.service';
import {LayoutService, LayoutSizeData} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {TourDocSearchForm, TourDocSearchFormFactory} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {Facets} from '@dps/mycms-commons/dist/search-commons/model/container/facets';
import {AngularMarkdownService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-markdown.service';
import {AngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-html.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {GenericTrackingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/generic-tracking.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {environment} from '../../../../environments/environment';
import {SectionPageComponent} from '@dps/mycms-frontend-commons/dist/frontend-pdoc-commons/components/sectionpage/section-page.component';

export interface TourDocSectionPageComponentAvailableTabs {
    IMAGE?: boolean;
    ODIMGOBJECT?: boolean;
    VIDEO?: boolean;
    LOCATION?: boolean;
    NEWS?: boolean;
    ROUTE?: boolean;
    TRACK?: boolean;
    TRIP?: boolean;
    ALL?: boolean;
}

export interface TourDocSectionPageComponentDashboardRows {
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
    availableTabs: TourDocSectionPageComponentAvailableTabs = {
        IMAGE: true,
        ROUTE: true,
        TRACK: true,
        LOCATION: true,
        TRIP: true,
        VIDEO: true,
        ALL: true
    };
    availableDashboardColumns: TourDocSectionPageComponentAvailableTabs = {
        ODIMGOBJECT: true,
        IMAGE: true,
        VIDEO: true,
        TRACK: true,
        ROUTE: true
    };
    availableToDoDashboardRows: TourDocSectionPageComponentDashboardRows = {
    };
    availableDoneDashboardRows: TourDocSectionPageComponentDashboardRows = {
    };
    private layoutSize: LayoutSizeData;

    constructor(route: ActivatedRoute, pdocDataService: PDocDataService,
                commonRoutingService: CommonRoutingService, private searchFormConverter: TourDocSearchFormConverter,
                errorResolver: ErrorResolver, private tdocRoutingService: CommonDocRoutingService,
                toastr: ToastrService, pageUtils: PageUtils,
                angularMarkdownService: AngularMarkdownService, angularHtmlService: AngularHtmlService,
                cd: ChangeDetectorRef, trackingProvider: GenericTrackingService, platformService: PlatformService,
                layoutService: LayoutService, appService: GenericAppService) {
        super(route, pdocDataService, commonRoutingService, errorResolver, toastr,
            pageUtils, angularMarkdownService, angularHtmlService, cd, trackingProvider, platformService,
            layoutService, appService);
    }

    getFiltersForType(record: PDocRecord, type: string, sort?: string): any {
        const filters = {
            type: type
        };

        filters['theme'] = record.theme;
        if (type === 'IMAGE') {
            filters['perPage'] = 6;
            if (this.layoutSize && this.layoutSize.width > 1300 && this.layoutSize.width < 1400) {
                filters['perPage'] = 5;
            }
        } else {
            filters['perPage'] = 5;
        }

        if (sort) {
            filters['sort'] = sort;
            if (sort === 'ratePers') {
                filters['moreFilter'] = 'personalRateOverall:8,9,10,11,12,13,14,15';
            }
        }

        if (type === 'NEWS') {
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

    getDashboardFiltersForType(record: PDocRecord, profile: string, type: string, sort?: string): any {
        const filters = this.getFiltersForType(record, type, sort);
        switch (profile) {
            case 'unrated':
                filters['moreFilter'] = filters['moreFilter'] ? filters['moreFilter'] + ';' : '';
                filters['moreFilter'] = 'personalRateOverall:null,0';
                break;
            case 'rated':
                filters['moreFilter'] = filters['moreFilter'] ? filters['moreFilter'] + ';' : '';
                filters['moreFilter'] = 'personalRateOverall:1,2,3,4,5,6,7,8,9,10,11,12,13,14,15';
                break;
            case 'objectDetectionOpen':
                filters['moreFilter'] = filters['moreFilter'] ? filters['moreFilter'] + ';' : '';
                filters['moreFilter'] = 'objectDetectionState:OPEN';
                break;
            case 'objectDetectionToDo':
                filters['moreFilter'] = filters['moreFilter'] ? filters['moreFilter'] + ';' : '';
                filters['moreFilter'] = 'objectDetectionState:RUNNING_MANUAL_CORRECTION_NEEDED,RUNNING_MANUAL_DETAIL_NEEDED,' +
                    'RUNNING_SUGGESTED';
                break;
            case 'objectDetectionDetailNeeded':
                filters['moreFilter'] = filters['moreFilter'] ? filters['moreFilter'] + ';' : '';
                filters['moreFilter'] = 'objectDetectionState:RUNNING_MANUAL_DETAIL_NEEDED';
                break;
            case 'objectDetectionCorrectionNeeded':
                filters['moreFilter'] = filters['moreFilter'] ? filters['moreFilter'] + ';' : '';
                filters['moreFilter'] = 'objectDetectionState:RUNNING_MANUAL_CORRECTION_NEEDED';
                break;
            case 'objectDetectionSuggested':
                filters['moreFilter'] = filters['moreFilter'] ? filters['moreFilter'] + ';' : '';
                filters['moreFilter'] = 'objectDetectionState:RUNNING_SUGGESTED';
                break;
            case 'objectDetectionError':
                filters['moreFilter'] = filters['moreFilter'] ? filters['moreFilter'] + ';' : '';
                filters['moreFilter'] = 'objectDetectionState:ERROR';
                break;
            case 'objectDetectionDone':
                filters['moreFilter'] = filters['moreFilter'] ? filters['moreFilter'] + ';' : '';
                filters['moreFilter'] = 'objectDetectionState:RUNNING_NO_SUGGESTION,' +
                    'RUNNING_MANUAL_APPROVED,RUNNING_MANUAL_REJECTED,RUNNING_MANUAL_DETAILED,' +
                    'DONE_APPROVAL_PROCESSED,DONE_REJECTION_PROCESSED,DONE_CORRECTION_PROCESSED,DONE_DETAIL_PROCESSED';
                break;
        }

        return filters;
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
            nearbyAddress: this.tdocSearchForm.nearbyAddress,
            fulltext: this.tdocSearchForm.fulltext
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

    protected doProcessAfterResolvedData(config: {}): void {
        this.tdocRoutingService.setLastBaseUrl(this.baseSearchUrl);
        this.tdocRoutingService.setLastSearchUrl(this.getToSearchUrl());
    }

}
