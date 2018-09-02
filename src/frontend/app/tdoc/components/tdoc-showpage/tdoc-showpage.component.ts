import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewContainerRef} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {ActivatedRoute} from '@angular/router';
import {ToastsManager} from 'ng2-toastr';
import {Layout, LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {AngularMarkdownService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-markdown.service';
import {AngularHtmlService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/angular-html.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {GenericTrackingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/generic-tracking.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {TourDocSearchForm} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {Facets} from '@dps/mycms-commons/dist/search-commons/model/container/facets';
import {TourDocSearchFormConverter} from '../../../shared-tdoc/services/tdoc-searchform-converter.service';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {isArray, isNumber} from 'util';
import {TourDocContentUtils} from '../../../shared-tdoc/services/tdoc-contentutils.service';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {
    CommonDocShowpageComponent,
    CommonDocShowpageComponentConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-showpage.component';
import {TourDocRoutingService} from '../../../../shared/tdoc-commons/services/tdoc-routing.service';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'app-tdoc-showpage',
    templateUrl: './tdoc-showpage.component.html',
    styleUrls: ['./tdoc-showpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocShowpageComponent extends CommonDocShowpageComponent<TourDocRecord, TourDocSearchForm, TourDocSearchResult,
    TourDocDataService> {
    tracks: TourDocRecord[] = [];
    tagcloudSearchResult = new TourDocSearchResult(new TourDocSearchForm({}), 0, undefined, new Facets());
    flgShowMap = false;
    flgShowProfileMap = false;
    flgShowTopImages = true;
    flgMapAvailable = false;
    flgProfileMapAvailable = false;
    flgTopImagesAvailable = false;
    defaultSubImageLayout = Layout.SMALL;
    showResultListTrigger: {
        IMAGE: boolean|number;
        VIDEO: boolean|number;
        LOCATION: boolean|number;
        NEWS: boolean|number;
        ROUTE: boolean|number;
        TOPIMAGE: boolean|number;
        TRACK: boolean|number;
        TRIP: boolean|number;
    } = {
        IMAGE: false,
        VIDEO: false,
        LOCATION: false,
        NEWS: false,
        ROUTE: false,
        TOPIMAGE: false,
        TRACK: false,
        TRIP: false
    };
    availableTabs = {
        'IMAGE': true,
        'ROUTE': true,
        'TRACK': true,
        'LOCATION': true,
        'TRIP': true,
        'VIDEO': true,
        'NEWS': true
    };

    constructor(route: ActivatedRoute, cdocRoutingService: TourDocRoutingService,
                toastr: ToastsManager, vcr: ViewContainerRef, contentUtils: TourDocContentUtils,
                errorResolver: ErrorResolver, pageUtils: PageUtils, commonRoutingService: CommonRoutingService,
                angularMarkdownService: AngularMarkdownService, angularHtmlService: AngularHtmlService,
                cd: ChangeDetectorRef, trackingProvider: GenericTrackingService, appService: GenericAppService,
                platformService: PlatformService, protected searchFormConverter: TourDocSearchFormConverter,
                layoutService: LayoutService) {
        super(route, cdocRoutingService, toastr, vcr, contentUtils, errorResolver, pageUtils, commonRoutingService,
            angularMarkdownService, angularHtmlService, cd, trackingProvider, appService, platformService, layoutService, environment);
    }

    onRouteTracksFound(searchresult: TourDocSearchResult) {
        this.onTackCloudRoutesFound(searchresult);
        this.onTracksFound(searchresult);
    }

    onTackCloudRoutesFound(searchresult: TourDocSearchResult) {
        this.tagcloudSearchResult = searchresult;
    }

    onTracksFound(searchresult: TourDocSearchResult) {
        const realTracks = [];
        if (searchresult !== undefined && searchresult.currentRecords !== undefined) {
            for (const record of searchresult.currentRecords) {
                if (record.gpsTrackBasefile || record.geoLoc !== undefined
                    || (record.gpsTrackSrc !== undefined && record.gpsTrackSrc.length > 20)) {
                    realTracks.push(record);
                    this.flgMapAvailable = true;
                    this.flgProfileMapAvailable = true;

                    this.flgShowMap = this.flgMapAvailable;
                    this.calcShowMaps();
                }
            }
        }
        this.tracks = realTracks;

        this.cd.markForCheck();
    }

    onTopImagesFound(searchResult: TourDocSearchResult) {
        if (searchResult === undefined || searchResult.recordCount <= 3) {
            this.flgTopImagesAvailable = false;
        } else {
            this.flgTopImagesAvailable = true;
        }
        this.flgShowTopImages = this.flgTopImagesAvailable;
        if (!this.layoutService.isDesktop()) {
            this.flgShowTopImages = false;
        }
        this.cd.markForCheck();

        return false;
    }

    onTagcloudClicked(filterValue: any, filter: string) {
        const filters = this.getFiltersForType(this.record, 'ROUTE');
        filters[filter] = filterValue;
        const searchForm = new TourDocSearchForm(filters);
        const url = this.searchFormConverter.searchFormToUrl(this.baseSearchUrl, searchForm);
        this.commonRoutingService.navigateByUrl(url);

        return false;
    }


    getFiltersForType(record: TourDocRecord, type: string): any {
        const minPerPage = isNumber(this.showResultListTrigger[type]) ? this.showResultListTrigger[type] : 0;

        return (<TourDocContentUtils>this.contentUtils).getTourDocSubItemFiltersForType(record, type,
            (this.pdoc ? this.pdoc.theme : undefined), minPerPage);
    }

    protected getComponentConfig(config: {}): CommonDocShowpageComponentConfig {
        return {
            baseSearchUrl: ['tdoc'].join('/'),
            baseSearchUrlDefault: ['tdoc'].join('/')
        };
    }

    protected configureProcessingOfResolvedData(): void {
        const me = this;
        const config = me.appService.getAppConfig();
        if (BeanUtils.getValue(config, 'components.tdoc-showpage.showBigImages') === true) {
            this.defaultSubImageLayout = Layout.BIG;
        }
        if (BeanUtils.getValue(config, 'components.tdoc-showpage.availableTabs') !== undefined) {
            me.availableTabs = BeanUtils.getValue(config, 'components.tdoc-showpage.availableTabs');
        }
        if (isArray(BeanUtils.getValue(config, 'components.tdoc-showpage.allowedQueryParams'))) {
            const allowedParams = BeanUtils.getValue(config, 'components.tdoc-showpage.allowedQueryParams');
            for (const type in me.showResultListTrigger) {
                const paramName = 'show' + type;
                if (allowedParams.indexOf(paramName) >= 0 && me.queryParamMap && me.queryParamMap.get(paramName)) {
                    me.showResultListTrigger[type] =
                        TourDocSearchForm.genericFields.perPage.validator.sanitize(me.queryParamMap.get(paramName));
                }
            }
        }
    }

    protected getConfiguredIndexableTypes(config: {}): string[] {
        let indexableTypes = [];
        if (BeanUtils.getValue(config, 'services.seo.tdocIndexableTypes')) {
            indexableTypes = config['services']['seo']['tdocIndexableTypes'];
        }

        return indexableTypes;
    }

    protected doProcessAfterResolvedData(): void {
        const me = this;
        me.tagcloudSearchResult = new TourDocSearchResult(new TourDocSearchForm({}), 0, undefined, new Facets());

        if (me.record.gpsTrackBasefile || me.record.geoLoc !== undefined
            || (me.record.gpsTrackSrc !== undefined && me.record.gpsTrackSrc.length > 20)) {
            me.tracks = [me.record];
            me.flgMapAvailable = true;
            me.flgProfileMapAvailable = (me.record.gpsTrackBasefile !== undefined
                || (me.record.gpsTrackSrc !== undefined && me.record.gpsTrackSrc.length > 20));
        } else {
            me.tracks = [];
            me.flgMapAvailable = false;
            me.flgProfileMapAvailable = false;
        }

        me.flgShowMap = this.flgMapAvailable;
        me.calcShowMaps();
        me.flgTopImagesAvailable = true;
        me.flgShowTopImages = true;
    }

    private calcShowMaps() {
        if (this.layoutService.isSpider() || this.layoutService.isServer()) {
            this.flgShowProfileMap = false;
            this.flgShowMap = false;
            return;
        }
        if (!this.flgProfileMapAvailable) {
            this.flgShowProfileMap = false;
            return;
        }
        if (!this.layoutService.isDesktop() &&
            (this.record.type === 'LOCATION' || this.record.type === 'TRIP' || this.record.type === 'NEWS')) {
            this.flgShowProfileMap = false;
            return;
        }

        this.flgShowProfileMap = true;
    }
}
