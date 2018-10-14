import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocRecord} from '../../../../shared/tdoc-commons/model/records/tdoc-record';
import {ActivatedRoute} from '@angular/router';
import {TourDocSearchForm} from '../../../../shared/tdoc-commons/model/forms/tdoc-searchform';
import {TourDocSearchResult} from '../../../../shared/tdoc-commons/model/container/tdoc-searchresult';
import {TourDocSearchFormConverter} from '../../../shared-tdoc/services/tdoc-searchform-converter.service';
import {ToastrService} from 'ngx-toastr';
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
} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-albumpage/cdoc-albumpage.component';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {environment} from '../../../../environments/environment';
import {TourDocPlaylistService} from '../../../shared-tdoc/services/tdoc-playlist.service';
import {CommonDocMultiActionManager} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-multiaction.manager';
import {TourDocActionTagService} from '../../../shared-tdoc/services/tdoc-actiontag.service';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {TourDocSearchFormUtils} from '../../../shared-tdoc/services/tdoc-searchform-utils.service';

@Component({
    selector: 'app-tdoc-albumpage',
    templateUrl: './tdoc-albumpage.component.html',
    styleUrls: ['../../../../../../node_modules/@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/components/cdoc-albumpage/cdoc-albumpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourDocAlbumpageComponent
    extends CommonDocAlbumpageComponent<TourDocRecord, TourDocSearchForm, TourDocSearchResult, TourDocDataService> {

    constructor(route: ActivatedRoute, commonRoutingService: CommonRoutingService,
                errorResolver: ErrorResolver, cdocDataService: TourDocDataService,
                searchFormConverter: TourDocSearchFormConverter, cdocRoutingService: TourDocRoutingService,
                toastr: ToastrService, pageUtils: PageUtils, cd: ChangeDetectorRef,
                trackingProvider: GenericTrackingService, public fb: FormBuilder, cdocAlbumService: TourDocAlbumService,
                appService: GenericAppService, platformService: PlatformService, layoutService: LayoutService,
                searchFormUtils: SearchFormUtils, tdocSearchFormUtils: TourDocSearchFormUtils,
                playlistService: TourDocPlaylistService, protected actionService: TourDocActionTagService) {
        super(route, commonRoutingService, errorResolver, cdocDataService, searchFormConverter, cdocRoutingService, toastr,
            pageUtils, cd, trackingProvider, fb, cdocAlbumService, appService, platformService, layoutService, searchFormUtils,
            tdocSearchFormUtils, playlistService, new CommonDocMultiActionManager(appService, actionService), environment);
    }

    protected getComponentConfig(config: {}): CommonDocAlbumpageComponentConfig {
        return {
            baseAlbumUrl: 'tdoc/album',
            baseSearchUrl: ['tdoc', ''].join('/'),
            baseSearchUrlDefault: ['tdoc', ''].join('/'),
            maxAllowedItems: config && config['tdocMaxItemsPerAlbum'] >= 0 ? config['tdocMaxItemsPerAlbum'] : -1,
            autoPlayAllowed: BeanUtils.getValue(config, 'permissions.allowAutoPlay') &&
                BeanUtils.getValue(config, 'components.tdoc-albumpage.allowAutoplay') + '' === 'true',
            m3uAvailable: BeanUtils.getValue(config, 'permissions.m3uAvailable') &&
                BeanUtils.getValue(config, 'components.tdoc-albumpage.m3uAvailable') + '' === 'true'
        };
    }
}
