import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef} from '@angular/core';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {ActivatedRoute} from '@angular/router';
import {TourDocSearchForm} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {TourDocSearchFormConverter} from '../../../shared-tdoc/services/tdoc-searchform-converter.service';
import {ToastrService} from 'ngx-toastr';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import * as L from 'leaflet';
import {GenericTrackingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/generic-tracking.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {MapElement} from '@dps/mycms-frontend-commons/dist/angular-maps/services/leaflet-geo.plugin';
import {
    CommonDocSearchpageComponent,
    CommonDocSearchpageComponentConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-searchpage.component';
import {TourDocRoutingService} from '../../../../shared/tdoc-commons/services/tdoc-routing.service';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {environment} from '../../../../environments/environment';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {TourDocActionTagService} from '../../../shared-tdoc/services/tdoc-actiontag.service';
import {TourDocSearchFormUtils} from '../../../shared-tdoc/services/tdoc-searchform-utils.service';
import {CommonDocMultiActionManager} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-multiaction.manager';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';

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
    currentMapTDocId = undefined;
    profileMapElements: MapElement[] = [];
    flgShowMap = false;
    flgShowProfileMap = false;
    flgMapAvailable = false;
    flgProfileMapAvailable = false;

    constructor(route: ActivatedRoute, commonRoutingService: CommonRoutingService, errorResolver: ErrorResolver,
                tdocDataService: TourDocDataService, searchFormConverter: TourDocSearchFormConverter,
                protected cdocRoutingService: TourDocRoutingService, toastr: ToastrService, pageUtils: PageUtils,
                cd: ChangeDetectorRef, trackingProvider: GenericTrackingService, appService: GenericAppService,
                platformService: PlatformService, layoutService: LayoutService, searchFormUtils: SearchFormUtils,
                tdocSearchFormUtils: TourDocSearchFormUtils, protected actionService: TourDocActionTagService,
                protected elRef: ElementRef) {
        super(route, commonRoutingService, errorResolver, tdocDataService, searchFormConverter, cdocRoutingService,
            toastr, pageUtils, cd, trackingProvider, appService, platformService, layoutService, searchFormUtils,
            tdocSearchFormUtils, new CommonDocMultiActionManager(appService, actionService), environment);
    }

    onMapTourDocClicked(tdoc: TourDocRecord) {
        console.log("tdocClicked", tdoc);
    }

    onMapCenterChanged(newCenter: L.LatLng) {
        console.log("newCenter", newCenter);
    }

    onShowItemOnMap(tdoc: TourDocRecord) {
        this.currentMapTDocId = undefined;
        if (tdoc) {
            this.currentMapTDocId = tdoc.id;
            this.pageUtils.scrollToTopOfElement(this.elRef);
            this.cd.markForCheck();
        }
    }

    onCreateNewRecord(type: string) {
        this.cdocRoutingService.navigateToCreate(type, null, null);
        return false;
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
            baseSearchUrlDefault: ['tdoc'].join('/'),
            maxAllowedM3UExportItems: BeanUtils.getValue(config, 'services.serverItemExport.maxAllowedM3UItems'),
            availableCreateActionTypes: BeanUtils.getValue(config, 'components.tdoc-searchpage.availableCreateActionTypes')
        };
    }

    protected doProcessAfterResolvedData(config: {}): void {
        super.doProcessAfterResolvedData(config);
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

        if (searchResult === undefined) {
            // console.log('empty searchResult', tdocSearchResult);
            this.flgMapAvailable = false;
            this.flgProfileMapAvailable = false;
            this.flgShowProfileMap = this.flgProfileMapAvailable;
        } else {
            // console.log('update searchResult', tdocSearchResult);
            this.flgMapAvailable = this.mapCenterPos !== undefined || this.searchResult.recordCount > 0;
            this.flgProfileMapAvailable = this.flgMapAvailable;
        }

        this.flgShowMap = this.flgMapAvailable;
        this.flgShowProfileMap = this.flgShowProfileMap && this.flgProfileMapAvailable;
        this.calcShowMaps();
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
