/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TourDocSearchFormConverter} from '../../../shared-tdoc/services/tdoc-searchform-converter.service';
import {ToastModule, ToastsManager} from 'ng2-toastr';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ActivatedRouteStub} from '@dps/mycms-frontend-commons/dist/testing/router-stubs';
import {TourDocDataServiceStub} from '../../../../testing/tdoc-dataservice-stubs';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {ErrorResolver} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/resolver/error.resolver';
import {PageUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/page.utils';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {RouterStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/router-stubs';
import {Angulartics2} from 'angulartics2';
import {GenericTrackingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/generic-tracking.service';
import {Angulartics2Stub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/angulartics2-stubs';
import {TourDocAlbumpageComponent} from './tdoc-albumpage.component';
import {TourDocAlbumService} from '../../../shared-tdoc/services/tdoc-album.service';
import {FormBuilder} from '@angular/forms';
import {AppServiceStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/appservice-stubs';
import {GenericAppService} from '@dps/mycms-commons/dist/commons/services/generic-app.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {TourDocRoutingService} from '../../../../shared/tdoc-commons/services/tdoc-routing.service';
import {PlatformService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/platform.service';
import {LayoutService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/layout.service';

describe('TourDocAlbumpageComponent', () => {
    let component: TourDocAlbumpageComponent;
    let fixture: ComponentFixture<TourDocAlbumpageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TourDocAlbumpageComponent],
            imports: [
                NgbModule.forRoot(),
                ToastModule.forRoot(),
                TranslateModule.forRoot(),
                NoopAnimationsModule
            ],
            providers: [
                { provide: TourDocDataService, useValue: new TourDocDataServiceStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: Router, useValue: new RouterStub() },
                CommonRoutingService,
                TourDocSearchFormConverter,
                SearchFormUtils,
                { provide: GenericAppService, useValue: new AppServiceStub() },
                { provide: SearchParameterUtils, useValue: new SearchParameterUtils() },
                CommonDocRoutingService,
                TourDocRoutingService,
                ToastsManager,
                TranslateService,
                ErrorResolver,
                PageUtils,
                GenericTrackingService,
                TourDocAlbumService,
                FormBuilder,
                { provide: Angulartics2, useValue: new Angulartics2Stub() },
                PlatformService,
                LayoutService
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TourDocAlbumpageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
