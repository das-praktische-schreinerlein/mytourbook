import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {TourDocSearchForm} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {TourDocSearchFormConverter} from '../../services/tdoc-searchform-converter.service';
import {ToastrService} from 'ngx-toastr';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {
    CommonDocInlineSearchpageComponent
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-inline-searchpage/cdoc-inline-searchpage.component';
import {TourDocRoutingService} from '../../../../shared/tdoc-commons/services/tdoc-routing.service';
import {CommonDocMultiActionManager} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-multiaction.manager';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {TourDocSearchFormUtils} from '../../services/tdoc-searchform-utils.service';
import {TourDocActionTagService} from '../../services/tdoc-actiontag.service';
import {CommonDocRecord} from '@dps/mycms-commons/dist/search-commons/model/records/cdoc-entity-record';
import {MapElement} from '@dps/mycms-frontend-commons/dist/angular-maps/services/leaflet-geo.plugin';
import * as L from 'leaflet';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {MapState, TourDocMapStateService} from '../../services/tdoc-mapstate.service';

@Component({
    selector: 'app-tdoc-inline-searchpage',
    templateUrl: './tdoc-inline-searchpage.component.html',
    styleUrls: ['./tdoc-inline-searchpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocInlineSearchpageComponent extends
    CommonDocInlineSearchpageComponent<TourDocRecord, TourDocSearchForm, TourDocSearchResult, TourDocDataService> {

    @Input()
    public showItemMapFlag ? = false;

    @Input()
    public showShortForm ? = false;

    @Input()
    public baseSearchUrl ? = 'tdoc/';

    @Input()
    public noHeader ? = false;

    @Input()
    public noCount ? = false;

    @Input()
    public flgMapEnabled ? = false;

    @Output()
    public showItemOnMap ?: EventEmitter<CommonDocRecord> = new EventEmitter();

    @Input()
    public alternativeMultiActionmanager ?: CommonDocMultiActionManager<any, any, any, any>;

    @Output()
    public mapCreated ?: EventEmitter<L.Map> = new EventEmitter();

    @Output()
    public centerChanged ?: EventEmitter<L.LatLng> = new EventEmitter();

    @Output()
    public tdocClicked ?: EventEmitter<TourDocRecord> = new EventEmitter();

    @Output()
    public mapElementsFound ?: EventEmitter<MapElement[]> = new EventEmitter();

    mapState: MapState = {
        mapCenterPos: undefined,
        mapZoom: 9,
        mapElements: [],
        currentMapTDocId: undefined,
        profileMapElements: [],
        flgMapEnabled: this.flgMapEnabled,
        flgShowMap: false,
        flgShowProfileMap: false,
        flgMapAvailable: false,
        flgProfileMapAvailable: false,
    }

    constructor(appService: GenericAppService, commonRoutingService: CommonRoutingService,
                tdocDataService: TourDocDataService, protected searchFormConverter: TourDocSearchFormConverter,
                cdocRoutingService: TourDocRoutingService, toastr: ToastrService,
                cd: ChangeDetectorRef, elRef: ElementRef, pageUtils: PageUtils, searchFormUtils: SearchFormUtils,
                tdocSearchFormUtils: TourDocSearchFormUtils, protected actionService: TourDocActionTagService,
                protected layoutService: LayoutService, protected mapStateService: TourDocMapStateService) {
        super(appService, commonRoutingService, tdocDataService, searchFormConverter, cdocRoutingService,
            toastr, cd, elRef, pageUtils, searchFormUtils, tdocSearchFormUtils,
            new CommonDocMultiActionManager(appService, actionService));
    }

    onShowItemOnMap(tdoc: TourDocRecord) {
        if (this.showItemOnMap) {
            this.showItemOnMap.emit(tdoc);
        }
    }

    onMapTourDocClicked(tdoc: TourDocRecord) {
        if (this.tdocClicked) {
            this.tdocClicked.emit(tdoc);
        }
    }

    onMapCenterChanged(newCenter: L.LatLng) {
        if (this.centerChanged) {
            this.centerChanged.emit(newCenter);
        }
    }

    onMapElementsFound(mapElements: MapElement[]) {
        this.mapStateService.onMapElementsFound(this.mapState, mapElements);
        this.cd.markForCheck();

        return false;
    }

    onProfileMapElementsFound(mapElements: MapElement[]) {
        this.mapStateService.onProfileMapElementsFound(this.mapState, mapElements);
        this.cd.markForCheck();

        return false;
    }

    protected doCheckSearchResultAfterSearch(searchResult: TourDocSearchResult): void {
        super.doCheckSearchResultAfterSearch(searchResult);
        this.mapStateService.doCheckSearchResultAfterSearch(this.mapState, searchResult);
    }

    protected updateData(): void {
        if (this.alternativeMultiActionmanager) {
            this.multiActionManager = this.alternativeMultiActionmanager;
        }

        this.mapState.flgMapEnabled = this.flgMapEnabled;

        super.updateData();
    }

    // TODO convert searchform on super too
    protected doSearch() {
        this.searchFormConverter.paramsToSearchForm(
            this.searchFormConverter.searchFormToValueMap(this.searchForm),
            {},
            this.searchForm,
            {});
        super.doSearch();

        return false;
    }


}
