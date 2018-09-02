import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewContainerRef} from '@angular/core';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {ActivatedRoute} from '@angular/router';
import {TourDocSearchForm} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {TourDocSearchFormConverter} from '../../../shared-tdoc/services/tdoc-searchform-converter.service';
import {ToastsManager} from 'ng2-toastr';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {GenericTrackingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/generic-tracking.service';
import {FormBuilder} from '@angular/forms';
import {TourDocAlbumService} from '../../../shared-tdoc/services/tdoc-album.service';
import {BeanUtils} from '@dps/mycms-commons/dist/commons/utils/bean.utils';
import {TourDocRoutingService} from '../../../../shared/tdoc-commons/services/tdoc-routing.service';
import {
    CommonDocAlbumpageComponent,
    CommonDocAlbumpageComponentConfig
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-albumpage.component';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'app-tdoc-albumpage',
    templateUrl: './tdoc-albumpage.component.html',
    styleUrls: ['./tdoc-albumpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocAlbumpageComponent extends CommonDocAlbumpageComponent<TourDocRecord, TourDocSearchForm, TourDocSearchResult, TourDocDataService> {
    constructor(protected route: ActivatedRoute, protected commonRoutingService: CommonRoutingService,
                protected errorResolver: ErrorResolver, protected cdocDataService: TourDocDataService,
                protected searchFormConverter: TourDocSearchFormConverter, protected cdocRoutingService: TourDocRoutingService,
                protected toastr: ToastsManager, vcr: ViewContainerRef, protected pageUtils: PageUtils, protected cd: ChangeDetectorRef,
                protected trackingProvider: GenericTrackingService, public fb: FormBuilder, protected cdocAlbumService: TourDocAlbumService,
                protected appService: GenericAppService, platformService: PlatformService,
                layoutService: LayoutService) {
        super(route, commonRoutingService, errorResolver, cdocDataService, searchFormConverter, cdocRoutingService, toastr, vcr,
            pageUtils, cd, trackingProvider, fb, cdocAlbumService, appService, platformService, layoutService, environment);
    }

    protected getComponentConfig(config: {}): CommonDocAlbumpageComponentConfig {
        return {
            baseAlbumUrl: 'tdoc/album',
            baseSearchUrl: ['tdoc', ''].join('/'),
            baseSearchUrlDefault: ['tdoc', ''].join('/'),
            maxAllowedItems: config && config['tdocMaxItemsPerAlbum'] >= 0 ? config['tdocMaxItemsPerAlbum'] : -1,
            autoPlayAllowed: BeanUtils.getValue(config, 'permissions.allowAutoPlay') &&
                BeanUtils.getValue(config, 'components.tdoc-albumpage.allowAutoplay') + '' === 'true'
        };
    }
}
