import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewContainerRef} from '@angular/core';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {ActivatedRoute} from '@angular/router';
import {TourDocSearchForm} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {TourDocSearchFormConverter} from '../../../shared-tdoc/services/tdoc-searchform-converter.service';
import {ToastsManager} from 'ng2-toastr';
import {LayoutService} from '../../../../shared/angular-commons/services/layout.service';
import {ErrorResolver} from '../../../../shared/frontend-cdoc-commons/resolver/error.resolver';
import {PageUtils} from '../../../../shared/angular-commons/services/page.utils';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import * as L from 'leaflet';
import {GenericTrackingService} from '../../../../shared/angular-commons/services/generic-tracking.service';
import {PlatformService} from '../../../../shared/angular-commons/services/platform.service';
import {MapElement} from '../../../../shared/angular-maps/services/leaflet-geo.plugin';
import {
    CommonDocSearchpageComponent,
    CommonDocSearchpageComponentConfig
} from '../../../../shared/frontend-cdoc-commons/components/cdoc-searchpage.component';
import {TourDocRoutingService} from '../../../../shared/tdoc-commons/services/tdoc-routing.service';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'app-tdoc-searchpage',
    templateUrl: './tdoc-searchpage.component.html',
    styleUrls: ['./tdoc-searchpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocSearchpageComponent extends CommonDocSearchpageComponent<TourDocRecord, TourDocSearchForm, TourDocSearchResult,
    TourDocDataService> {
    mapCenterPos: L.LatLng = undefined;
    mapZoom = 9;
    mapElements: MapElement[] = [];
    profileMapElements: MapElement[] = [];
    flgShowMap = false;
    flgShowProfileMap = false;
    flgMapAvailable = false;
    flgProfileMapAvailable = false;

    constructor(route: ActivatedRoute, commonRoutingService: CommonRoutingService, errorResolver: ErrorResolver,
                tdocDataService: TourDocDataService, searchFormConverter: TourDocSearchFormConverter,
                cdocRoutingService: TourDocRoutingService, toastr: ToastsManager, vcr: ViewContainerRef,
                pageUtils: PageUtils, cd: ChangeDetectorRef, trackingProvider: GenericTrackingService,
                appService: GenericAppService, platformService: PlatformService, layoutService: LayoutService) {
        super(route, commonRoutingService, errorResolver, tdocDataService, searchFormConverter, cdocRoutingService,
            toastr, vcr, pageUtils, cd, trackingProvider, appService, platformService, layoutService, environment);
    }

    onMapTourDocClicked(tdoc: TourDocRecord) {
        console.log("tdocClicked", tdoc);
    }

    onMapCenterChanged(newCenter: L.LatLng) {
        console.log("newCenter", newCenter);
    }

    onMapElementsFound(mapElements: MapElement[]) {
        this.mapElements = [];
        this.mapElements = mapElements;
        this.flgMapAvailable = this.mapElements.length > 0;
        this.flgProfileMapAvailable = this.flgProfileMapAvailable && this.flgMapAvailable;
        this.flgShowMap = this.flgMapAvailable && this.flgShowMap;
        this.calcShowMaps();
        this.cd.markForCheck();

        return false;
    }

    onProfileMapElementsFound(mapElements: MapElement[]) {
        this.profileMapElements = mapElements;
        this.flgProfileMapAvailable = this.profileMapElements.length > 0;
        this.flgShowProfileMap = this.flgProfileMapAvailable && this.flgShowProfileMap;
        this.calcShowMaps();
        this.cd.markForCheck();

        return false;
    }


    protected getComponentConfig(config: {}): CommonDocSearchpageComponentConfig {
        return {
            baseSearchUrl: ['tdoc'].join('/'),
            baseSearchUrlDefault: ['tdoc'].join('/')
        };
    }

    protected doProcessAfterResolvedData(config: {}): void {
        if (this.searchForm.nearby !== undefined && this.searchForm.nearby.length > 0) {
            const [lat, lon] = this.searchForm.nearby.split('_');
            this.mapCenterPos = new L.LatLng(+lat, +lon);
        } else {
            this.mapCenterPos = undefined;
        }
    }

    protected doPreChecksBeforeSearch(): boolean {
        if (this.searchForm.sort === 'distance' && (this.searchForm.nearby === undefined || this.searchForm.nearby === '')) {
            // console.log('doSearch: redirect because of sort/nearby form:', this.searchForm);
            this.searchForm.sort = 'relevance';
            this.sort = 'relvance';
            return this.redirectToSearch();
        }

        return super.doPreChecksBeforeSearch();
    }

    protected doCheckSearchResultAfterSearch(searchResult: TourDocSearchResult): void {
        super.doCheckSearchResultAfterSearch(searchResult);

        const me = this;
        if (searchResult === undefined) {
            // console.log('empty searchResult', tdocSearchResult);
            me.flgMapAvailable = false;
            me.flgProfileMapAvailable = false;
            me.flgShowProfileMap = me.flgProfileMapAvailable;
        } else {
            // console.log('update searchResult', tdocSearchResult);
            me.initialized = true;
            me.searchResult = searchResult;
            me.searchForm = searchResult.searchForm;
            me.flgMapAvailable = me.mapCenterPos !== undefined || me.searchResult.recordCount > 0;
            me.flgProfileMapAvailable = me.flgMapAvailable;
        }
        me.flgShowMap = me.flgMapAvailable;
        me.flgShowProfileMap = me.flgShowProfileMap && me.flgProfileMapAvailable;
        me.calcShowMaps();
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
        if (!this.layoutService.isDesktop() && this.profileMapElements && this.profileMapElements.length > 10) {
            this.flgShowProfileMap = false;
            return;
        }
    }
}
