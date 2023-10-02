import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef} from '@angular/core';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {ActivatedRoute, Router} from '@angular/router';
import {TourDocSearchForm} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {TourDocSearchFormConverter} from '../../../shared-tdoc/services/tdoc-searchform-converter.service';
import {ToastrService} from 'ngx-toastr';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {LatLng} from 'leaflet';
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
import {Location} from '@angular/common';
import {MapState, TourDocMapStateService} from '../../../shared-tdoc/services/tdoc-mapstate.service';
import {MapDocRecord} from '@dps/mycms-commons/dist/geo-commons/model/map-element.types';

export interface TourDocSearchpageComponentConfig extends CommonDocSearchpageComponentConfig {
}

@Component({
    selector: 'app-tdoc-searchpage',
    templateUrl: './tdoc-searchpage.component.html',
    styleUrls: ['./tdoc-searchpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocSearchpageComponent extends CommonDocSearchpageComponent<TourDocRecord, TourDocSearchForm, TourDocSearchResult,
    TourDocDataService> {
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

    constructor(route: ActivatedRoute, commonRoutingService: CommonRoutingService, errorResolver: ErrorResolver,
                tdocDataService: TourDocDataService, searchFormConverter: TourDocSearchFormConverter,
                protected cdocRoutingService: TourDocRoutingService, toastr: ToastrService, pageUtils: PageUtils,
                cd: ChangeDetectorRef, trackingProvider: GenericTrackingService, appService: GenericAppService,
                platformService: PlatformService, layoutService: LayoutService, searchFormUtils: SearchFormUtils,
                tdocSearchFormUtils: TourDocSearchFormUtils, protected actionService: TourDocActionTagService,
                protected elRef: ElementRef, location: Location, protected mapStateService: TourDocMapStateService,
                protected router: Router) {
        super(route, commonRoutingService, errorResolver, tdocDataService, searchFormConverter, cdocRoutingService,
            toastr, pageUtils, cd, trackingProvider, appService, platformService, layoutService, searchFormUtils,
            tdocSearchFormUtils, new CommonDocMultiActionManager(appService, actionService), environment, location);
    }

    onMapTourDocClicked(tdoc: MapDocRecord) {
        const me = this;
        me.router.navigate([{ outlets: { 'tdocmodalshow': ['tdocmodalshow', 'show', tdoc.type, tdoc.id] } }]).then(value => {});

        return false;
    }

    onMapCenterChanged(newCenter: LatLng) {
        console.log("newCenter", newCenter);
    }

    onShowItemOnMap(tdoc: TourDocRecord) {
        this.mapState.currentMapTDocId = undefined;
        if (tdoc) {
            this.mapState.currentMapTDocId = tdoc.id;
            this.pageUtils.scrollToTopOfElement(this.elRef);
            this.cd.markForCheck();
        }
    }

    onCreateNewRecord(type: string) {
        this.cdocRoutingService.navigateToCreate(type, null, null);
        return false;
    }

    onMapElementsFound(mapElements: MapElement[]) {
        this.mapStateService.onMapElementsFound(this.mapState, mapElements)
        this.cd.markForCheck();

        return false;
    }

    onProfileMapElementsFound(mapElements: MapElement[]) {
        this.mapStateService.onProfileMapElementsFound(this.mapState, mapElements);
        this.cd.markForCheck();

        return false;
    }


    protected getComponentConfig(config: {}): TourDocSearchpageComponentConfig {
        return {
            baseSearchUrl: ['tdoc'].join('/'),
            baseSearchUrlDefault: ['tdoc'].join('/'),
            maxAllowedM3UExportItems: BeanUtils.getValue(config, 'services.serverItemExport.maxAllowedM3UItems'),
            availableCreateActionTypes: BeanUtils.getValue(config, 'components.tdoc-searchpage.availableCreateActionTypes'),
            defaultLayoutPerType: BeanUtils.getValue(config, 'components.tdoc-searchpage.defaultLayoutPerType')
        };
    }

    protected configureComponent(config: {}): void {
        super.configureComponent(config);
        const componentConfig = this.getComponentConfig(config);
        this.defaultLayoutPerType = componentConfig.defaultLayoutPerType;
    }

    protected doProcessAfterResolvedData(config: {}): void {
        super.doProcessAfterResolvedData(config);
        if (this.searchForm.nearby !== undefined && this.searchForm.nearby.length > 0) {
            const [lat, lon] = this.searchForm.nearby.split('_');
            this.mapState.mapCenterPos = new LatLng(+lat, +lon);
        } else {
            this.mapState.mapCenterPos = undefined;
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

        this.mapStateService.doCheckSearchResultAfterSearch(this.mapState, searchResult)
    }

}
