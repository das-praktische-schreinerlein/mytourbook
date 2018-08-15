import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewContainerRef} from '@angular/core';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';
import {SDocRecord} from '../../../../shared/sdoc-commons/model/records/sdoc-record';
import {ActivatedRoute} from '@angular/router';
import {SDocSearchForm} from '../../../../shared/sdoc-commons/model/forms/sdoc-searchform';
import {SDocSearchResult} from '../../../../shared/sdoc-commons/model/container/sdoc-searchresult';
import {SDocSearchFormConverter} from '../../../shared-sdoc/services/sdoc-searchform-converter.service';
import {ToastsManager} from 'ng2-toastr';
import {ErrorResolver} from '../../../../shared/frontend-cdoc-commons/resolver/error.resolver';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {PageUtils} from '../../../../shared/angular-commons/services/page.utils';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {GenericTrackingService} from '../../../../shared/angular-commons/services/generic-tracking.service';
import {FormBuilder} from '@angular/forms';
import {SDocAlbumService} from '../../../shared-sdoc/services/sdoc-album.service';
import {BeanUtils} from '../../../../shared/commons/utils/bean.utils';
import {SDocRoutingService} from '../../../../shared/sdoc-commons/services/sdoc-routing.service';
import {
    AbstractCDocAlbumpageComponent,
    CommonDocAlbumpageComponentConfig
} from '../../../../shared/frontend-cdoc-commons/components/cdoc-albumpage.component';

@Component({
    selector: 'app-sdoc-albumpage',
    templateUrl: './sdoc-albumpage.component.html',
    styleUrls: ['./sdoc-albumpage.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SDocAlbumpageComponent extends AbstractCDocAlbumpageComponent<SDocRecord, SDocSearchForm, SDocSearchResult, SDocDataService> {
    constructor(protected route: ActivatedRoute, protected commonRoutingService: CommonRoutingService,
                protected errorResolver: ErrorResolver, protected cdocDataService: SDocDataService,
                protected searchFormConverter: SDocSearchFormConverter, protected cdocRoutingService: SDocRoutingService,
                protected toastr: ToastsManager, vcr: ViewContainerRef, protected pageUtils: PageUtils, protected cd: ChangeDetectorRef,
                protected trackingProvider: GenericTrackingService, public fb: FormBuilder, protected cdocAlbumService: SDocAlbumService,
                protected appService: GenericAppService) {
        super(route, commonRoutingService, errorResolver, cdocDataService, searchFormConverter, cdocRoutingService, toastr, vcr,
            pageUtils, cd, trackingProvider, fb, cdocAlbumService, appService);
    }

    protected getComponentConfig(config: {}): CommonDocAlbumpageComponentConfig {
        return {
            baseAlbumUrl: 'sdoc/album',
            baseSearchUrl: ['sdoc'].join('/'),
            baseSearchUrlDefault: ['sdoc'].join('/'),
            maxAllowedItems: config && config['sdocMaxItemsPerAlbum'] >= 0 ? config['sdocMaxItemsPerAlbum'] : -1,
            autoPlayAllowed: BeanUtils.getValue(config, 'permissions.allowAutoPlay') &&
                BeanUtils.getValue(config, 'components.sdoc-albumpage.allowAutoplay') + '' === 'true'
        };
    }
}
