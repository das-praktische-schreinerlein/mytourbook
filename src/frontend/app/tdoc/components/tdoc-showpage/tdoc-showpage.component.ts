import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild} from '@angular/core';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Layout, LayoutService, LayoutSizeData} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
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
import {MapState} from '../../../shared-tdoc/services/tdoc-mapstate.service';
import {TourDocJoinUtils} from '../../../shared-tdoc/services/tdoc-join.utils';

export interface TourDocShowpageComponentAvailableTabs {
    ALL_ENTRIES?: boolean;
    IMAGE?: boolean;
    IMAGE_FAVORITES?: boolean;
    IMAGE_NEARBY?: boolean;
    IMAGE_SIMILAR?: boolean;
    INFO?: boolean;
    ODIMGOBJECT?: boolean;
    VIDEO?: boolean;
    VIDEO_NEARBY?: boolean;
    LOCATION?: boolean;
    LOCATION_NEARBY?: boolean;
    NEWS?: boolean;
    DESTINATION?: boolean;
    ROUTE?: boolean;
    ROUTE_NEARBY?: boolean;
    TRACK?: boolean;
    TRIP?: boolean;
    TRIP_NEARBY?: boolean;
    POI?: boolean;
    POI_NEARBY?: boolean;
    ALL?: boolean;
}

@Component({
    selector: 'app-tdoc-showpage',
    templateUrl: './tdoc-showpage.component.html',
    styleUrls: ['./tdoc-showpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocShowpageComponent extends CommonDocShowpageComponent<TourDocRecord, TourDocSearchForm, TourDocSearchResult,
    TourDocDataService> {
    protected readonly environment = environment;
    tracks: TourDocRecord[] = [];
    geoTracks: {
        IMAGE?: TourDocRecord[];
        ODIMGOBJECT?: TourDocRecord[];
        VIDEO?: TourDocRecord[];
        LOCATION?: TourDocRecord[];
        NEWS?: TourDocRecord[];
        ROUTE?: TourDocRecord[];
        TOPIMAGE?: TourDocRecord[];
        TRACK?: TourDocRecord[];
        TRIP?: TourDocRecord[];
        POI?: TourDocRecord[];
    } = {
        IMAGE: [],
        ODIMGOBJECT: [],
        VIDEO: [],
        LOCATION: [],
        NEWS: [],
        ROUTE: [],
        TOPIMAGE: [],
        TRACK: [],
        TRIP: [],
        POI: []
    };
    tagcloudSearchResult = new TourDocSearchResult(new TourDocSearchForm({}), 0, undefined, new Facets());
    currentMapTDocId = undefined;
    flgShowTopImages = true;
    flgTopImagesAvailable = false;

    mapState: MapState = {
        mapCenterPos: undefined,
        mapZoom: 9,
        mapElements: [],
        currentMapTDocId: undefined,
        profileMapElements: [],
        flgMapEnabled: true,
        flgShowMap: false,
        flgShowProfileMap: false,
        flgMapAvailable: false,
        flgProfileMapAvailable: false,
    }

    defaultSubImageLayout = Layout.SMALL;
    showResultListTrigger: {
        ALL_ENTRIES?: boolean|number;
        DESTINATION?: boolean|number;
        IMAGE?: boolean|number;
        INFO?: boolean|number;
        ODIMGOBJECT?: boolean|number;
        VIDEO?: boolean|number;
        LOCATION?: boolean|number;
        NEWS?: boolean|number;
        ROUTE?: boolean|number;
        ROUTE_NEARBY?: boolean|number;
        TOPIMAGE?: boolean|number;
        IMAGE_SIMILAR?: boolean|number;
        TRACK?: boolean|number;
        TRIP?: boolean|number;
        POI?: boolean|number;
    } = {
        ALL_ENTRIES: true,
        DESTINATION: false,
        IMAGE: false,
        INFO: false,
        ODIMGOBJECT: false,
        VIDEO: false,
        LOCATION: true,
        NEWS: false,
        ROUTE: false,
        ROUTE_NEARBY: false,
        TOPIMAGE: false,
        IMAGE_SIMILAR: false,
        TRACK: false,
        TRIP: false,
        POI: false
    };
    availableTabs: TourDocShowpageComponentAvailableTabs = {
        ALL_ENTRIES: false,
        IMAGE: true,
        IMAGE_FAVORITES: false,
        IMAGE_NEARBY: true,
        IMAGE_SIMILAR: true,
        INFO: true,
        DESTINATION: true,
        ROUTE: true,
        ROUTE_NEARBY: true,
        TRACK: true,
        LOCATION: true,
        LOCATION_NEARBY: true,
        TRIP: true,
        VIDEO: true,
        NEWS: true,
        ODIMGOBJECT: true,
        POI: true,
        POI_NEARBY: true,
    };
    showItemObjectsFlag = false;

    private layoutSize: LayoutSizeData;

    @ViewChild('mainImage')
    mainImage: ElementRef;
    imageWidth = 0;

    constructor(route: ActivatedRoute, cdocRoutingService: TourDocRoutingService,
                toastr: ToastrService, contentUtils: TourDocContentUtils,
                errorResolver: ErrorResolver, pageUtils: PageUtils, commonRoutingService: CommonRoutingService,
                angularMarkdownService: AngularMarkdownService, angularHtmlService: AngularHtmlService,
                cd: ChangeDetectorRef, trackingProvider: GenericTrackingService, appService: GenericAppService,
                platformService: PlatformService, protected searchFormConverter: TourDocSearchFormConverter,
                layoutService: LayoutService, protected elRef: ElementRef, router: Router) {
        super(route, cdocRoutingService, toastr, contentUtils, errorResolver, pageUtils, commonRoutingService,
            angularMarkdownService, angularHtmlService, cd, trackingProvider, appService, platformService, layoutService,
            environment, router);
    }

    onRouteTracksFound(searchresult: TourDocSearchResult) {
        this.onTagCloudRoutesFound(searchresult);
        this.onGeoTracksFound(searchresult, 'ROUTE');
    }

    onTagCloudRoutesFound(searchresult: TourDocSearchResult) {
        this.tagcloudSearchResult = searchresult;
    }

    onGeoTracksFound(searchresult: TourDocSearchResult, type: string) {
        const typeTracks = [];
        if (searchresult !== undefined && searchresult.currentRecords !== undefined) {
            for (const record of searchresult.currentRecords) {
                typeTracks.push(record);
                if (record.gpsTrackBasefile || record.geoLoc !== undefined
                    || (record.gpsTrackSrc !== undefined && record.gpsTrackSrc.length > 20)) {
                    this.mapState.flgMapAvailable = true;
                    this.mapState.flgProfileMapAvailable = true;

                    this.mapState.flgShowMap = this.mapState.flgMapAvailable;
                    this.calcShowMaps();
                }
            }
        }
        this.geoTracks[type] = typeTracks;

        let allTracks = [];
        for (const key of ['ROUTE', 'TRACK', 'IMAGE', 'VIDEO', 'LOCATION', 'POI']) {
            if (this.geoTracks[key] !== undefined) {
                allTracks = allTracks.concat(this.geoTracks[key]);
            }
        }
        if (this.record.gpsTrackBasefile || this.record.geoLoc !== undefined
            || (this.record.gpsTrackSrc !== undefined && this.record.gpsTrackSrc.length > 20)) {
            allTracks.push(this.record);
        }
        this.tracks = allTracks;

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

    onShowItemOnMap(tdoc: TourDocRecord) {
        this.currentMapTDocId = undefined;
        if (tdoc) {
            this.currentMapTDocId = tdoc.id;
            const el = this.elRef.nativeElement.querySelector('#showMap');
            if (el !== undefined && (typeof el.scrollIntoView === 'function')) {
                el.scrollIntoView(true);
            }
            this.cd.markForCheck();
        }
    }

    onResizeMainImage() {
        if (this.mainImage !== undefined && this.mainImage.nativeElement['width'] !== this.imageWidth) {
            this.imageWidth = this.mainImage.nativeElement['width'];
            this.cd.markForCheck();
        }

        return true;
    }

    getFiltersForType(record: TourDocRecord, type: string): any {
        const minPerPage = isNumber(this.showResultListTrigger[type]) ? this.showResultListTrigger[type] : 0;

        const theme = this.pdoc ? this.pdoc.theme : undefined;
        const filters = (<TourDocContentUtils>this.contentUtils).getTourDocSubItemFiltersForType(record, type, theme, minPerPage);
        if (type === 'TOPIMAGE') {
            if (this.layoutSize && this.layoutSize.width > 1200 && this.layoutSize.width < 1480) {
                filters['perPage'] = 3;
            }
        } else if (type === 'LOCATION_NEARBY') {
            filters['type'] = 'LOCATION';
            filters['sort'] = 'distance';
            filters['where'] = undefined;
            filters['moreFilter'] = 'id_notin_is:' + record.id;
            filters['where'] = this.createNearByFilter(record, 5);
            if (record.type === 'LOCATION' && theme !== undefined) {
                filters['theme'] = theme;
            }
        } else if (type === 'ROUTE_NEARBY') {
            filters['type'] = 'ROUTE';
            filters['sort'] = 'distance';
            filters['moreFilter'] = 'id_notin_is:' + record.id;
            filters['where'] = this.createNearByFilter(record, 1);
        } else if (type === 'IMAGE_NEARBY') {
            filters['type'] = 'IMAGE';
            filters['sort'] = 'distance';
            filters['moreFilter'] = 'id_notin_is:' + record.id;
            filters['where'] = this.createNearByFilter(record, 1);
        } else if (type === 'POI_NEARBY') {
            filters['type'] = 'POI';
            filters['sort'] = 'distance';
            filters['moreFilter'] = 'id_notin_is:' + record.id;
            filters['where'] = this.createNearByFilter(record, 3);
        }

        return filters;
    }

    renderDesc(): string {
        if (this.record && (this.record.descMd === undefined || this.record.descMd.toLowerCase() === 'tododesc')) {
            this.setDesc(this.descSelector, '');
            this.flgDescRendered = false;
            return '';
        }

        return super.renderDesc();
    }

    protected createNearByFilter(record: TourDocRecord, distance: number): string {
        return record.geoLat !== undefined
            ? 'nearby:' + [record.geoLat, record.geoLon, distance].join('_') +
                '_,_nearbyAddress:' + record.locHirarchie.replace(/[^-a-zA-Z0-9_.äüöÄÜÖß]+/g, '')
            : 'blimblamblummichgibtesnicht';
    }

    protected onResize(layoutSizeData: LayoutSizeData): void {
        super.onResize(layoutSizeData);
        this.layoutSize = layoutSizeData;
        this.onResizeMainImage();
        this.cd.markForCheck();
    }

    protected getComponentConfig(config: {}): CommonDocShowpageComponentConfig {
        return {
            baseSearchUrl: ['tdoc'].join('/'),
            baseSearchUrlDefault: ['tdoc'].join('/'),
            modalOutletName: 'tdocmodalshow'
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

        const allowedParams = BeanUtils.getValue(config, 'components.tdoc-showpage.allowedQueryParams');
        if (me.queryParamMap && isArray(allowedParams)) {
            for (const type in me.showResultListTrigger) {
                const paramName = 'show' + type;
                const param = me.queryParamMap.get(paramName);
                if (allowedParams.indexOf(paramName) >= 0 && param) {
                    me.showResultListTrigger[type] =
                        TourDocSearchForm.genericFields.perPage.validator.sanitize(param);
                }
            }
        }

        if (environment.hideInternalDescLinks === true) {
            this.pageUtils.setGlobalStyle('.show-page #desc [href*="sections/"] { cursor: not-allowed; pointer-events: none; text-decoration: none; opacity: 0.5; color: currentColor; }'
                + ' .show-page #desc a[href*="sections/"]::before { content: \'\uD83D\uDEAB\'; font-size: smaller}',
                'tdocShowpageHideInternalDescLinks');
        } else {
            this.pageUtils.setGlobalStyle('', 'tdocShowpageHideInternalDescLinks');
        }

        if (environment.hideInternalImages === true) {
            this.pageUtils.setGlobalStyle('.show-page #desc img[src*="api/static/picturestore"] {display:none;}',
                'tdocShowpageHideInternalImages');
        } else {
            this.pageUtils.setGlobalStyle('', 'tdocShowpageHideInternalImages');
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
            me.geoTracks = {};
            me.mapState.flgMapAvailable = true;
            me.mapState.flgProfileMapAvailable = (me.record.gpsTrackBasefile !== undefined
                || (me.record.gpsTrackSrc !== undefined && me.record.gpsTrackSrc.length > 20));
        } else {
            me.tracks = [];
            me.geoTracks = {};
            me.mapState.flgMapAvailable = false;
            me.mapState.flgProfileMapAvailable = false;
        }

        const dummySearchResult: TourDocSearchResult =
            new TourDocSearchResult(undefined, 0, TourDocJoinUtils.preparePoiMapValuesFromRecord(this.record), undefined
        );
        this.onGeoTracksFound(dummySearchResult, 'POI');

        me.mapState.flgShowMap = this.mapState.flgMapAvailable;
        me.calcShowMaps();
        me.flgTopImagesAvailable = true;
        me.flgShowTopImages = true;
    }

    private calcShowMaps() {
        if (this.layoutService.isSpider() || this.layoutService.isServer()) {
            this.mapState.flgShowProfileMap = false;
            this.mapState.flgShowMap = false;
            return;
        }
        if (!this.mapState.flgProfileMapAvailable) {
            this.mapState.flgShowProfileMap = false;
            return;
        }
        if (!this.layoutService.isDesktop() &&
            (this.record.type === 'LOCATION' || this.record.type === 'TRIP' || this.record.type === 'NEWS')) {
            this.mapState.flgShowProfileMap = false;
            return;
        }

        this.mapState.flgShowProfileMap = true;
    }
}
