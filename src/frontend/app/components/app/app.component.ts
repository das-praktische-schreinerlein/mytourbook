import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injectable, LOCALE_ID} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {environment} from '../../../environments/environment';
import {ToastrService} from 'ngx-toastr';
import {AbstractAppComponent} from '@dps/mycms-frontend-commons/dist/frontend-section-commons/components/abstract-app.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
@Injectable()
export class AppComponent extends AbstractAppComponent {
    title = 'MyTourBook';

    constructor(appService: GenericAppService, toastr: ToastrService,
                translate: TranslateService, router: Router, @Inject(LOCALE_ID) locale: string,
                http: HttpClient, commonRoutingService: CommonRoutingService, cd: ChangeDetectorRef,
                platformService: PlatformService, pageUtils: PageUtils, layoutService: LayoutService) {
        super(appService, toastr, translate, router, locale, http, commonRoutingService, cd, platformService, pageUtils, layoutService,
            environment);
    }
}
