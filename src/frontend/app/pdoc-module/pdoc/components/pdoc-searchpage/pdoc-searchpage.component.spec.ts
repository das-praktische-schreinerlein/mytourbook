/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {PDocSearchpageComponent} from './pdoc-searchpage.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {PDocDataService} from '@dps/mycms-commons/dist/pdoc-commons/services/pdoc-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PDocSearchFormConverter} from '../../../shared-pdoc/services/pdoc-searchform-converter.service';
import {ToastrService} from 'ngx-toastr';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ActivatedRouteStub} from '@dps/mycms-frontend-commons/dist/testing/router-stubs';
import {PDocDataServiceStub} from '@dps/mycms-frontend-commons/dist/testing/pdoc-dataservice-stubs';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {RouterStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/router-stubs';
import {Angulartics2} from 'angulartics2';
import {GenericTrackingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/generic-tracking.service';
import {Angulartics2Stub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/angulartics2-stubs';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {PDocRoutingService} from '../../../shared-pdoc/services/pdoc-routing.service';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {AppServiceStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/appservice-stubs';
import {PDocSearchFormUtils} from '../../../shared-pdoc/services/pdoc-searchform-utils.service';
import {PDocActionTagService} from '../../../shared-pdoc/services/pdoc-actiontag.service';
import {ToastrServiceStub} from '@dps/mycms-frontend-commons/dist/testing/toasts-stubs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PDocContentUtils} from '../../../shared-pdoc/services/pdoc-contentutils.service';
import {Location} from '@angular/common';
import {PDocAlbumService} from '../../../shared-pdoc/services/pdoc-album.service';

describe('PDocSearchpageComponent', () => {
    let component: PDocSearchpageComponent;
    let fixture: ComponentFixture<PDocSearchpageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PDocSearchpageComponent],
            imports: [
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: PDocDataService, useValue: new PDocDataServiceStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: Router, useValue: new RouterStub() },
                NgbModal,
                { provide: Location, useValue: {} },
                CommonRoutingService,
                PDocSearchFormConverter,
                SearchFormUtils,
                { provide: SearchParameterUtils, useValue: new SearchParameterUtils() },
                CommonDocRoutingService,
                PDocRoutingService,
                { provide: ToastrService, useValue: new ToastrServiceStub() },
                TranslateService,
                ErrorResolver,
                PageUtils,
                { provide: GenericAppService, useValue: new AppServiceStub() },
                PlatformService,
                GenericTrackingService,
                { provide: Angulartics2, useValue: new Angulartics2Stub() },
                LayoutService,
                PDocSearchFormUtils,
                PDocActionTagService,
                PDocAlbumService,
                PDocContentUtils
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PDocSearchpageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
