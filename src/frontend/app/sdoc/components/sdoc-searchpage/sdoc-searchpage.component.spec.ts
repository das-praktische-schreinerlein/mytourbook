/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SDocSearchpageComponent} from './sdoc-searchpage.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SDocSearchFormConverter} from '../../../shared-sdoc/services/sdoc-searchform-converter.service';
import {ToastModule, ToastsManager} from 'ng2-toastr';
import {SDocRoutingService} from '../../../shared-sdoc/services/sdoc-routing.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ActivatedRouteStub} from '../../../../testing/router-stubs';
import {SDocDataServiceStub} from '../../../../testing/sdoc-dataservice-stubs';
import {SearchParameterUtils} from '../../../../shared/search-commons/services/searchparameter.utils';
import {ErrorResolver} from '../../../sections/resolver/error.resolver';
import {PageUtils} from '../../../../shared/angular-commons/services/page.utils';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {RouterStub} from '../../../../shared/angular-commons/testing/router-stubs';
import {Angulartics2} from 'angulartics2';
import {GenericTrackingService} from '../../../../shared/angular-commons/services/generic-tracking.service';
import {Angulartics2Stub} from '../../../../shared/angular-commons/testing/angulartics2-stubs';
import {PlatformService} from '../../../../shared/angular-commons/services/platform.service';
import {FromEventObservable} from 'rxjs/src/observable/FromEventObservable';

describe('SDocSearchpageComponent', () => {
    let component: SDocSearchpageComponent;
    let fixture: ComponentFixture<SDocSearchpageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocSearchpageComponent],
            imports: [
                ToastModule.forRoot(),
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: SDocDataService, useValue: new SDocDataServiceStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: Router, useValue: new RouterStub() },
                FromEventObservable,
                CommonRoutingService,
                SDocSearchFormConverter,
                { provide: SearchParameterUtils, useValue: new SearchParameterUtils() },
                SDocRoutingService,
                ToastsManager,
                TranslateService,
                ErrorResolver,
                PageUtils,
                PlatformService,
                GenericTrackingService,
                { provide: Angulartics2, useValue: new Angulartics2Stub() },
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocSearchpageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
