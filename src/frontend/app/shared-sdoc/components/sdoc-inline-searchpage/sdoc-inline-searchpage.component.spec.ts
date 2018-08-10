/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SDocInlineSearchpageComponent} from './sdoc-inline-searchpage.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SDocDataStore, SDocTeamFilterConfig} from '../../../../shared/sdoc-commons/services/sdoc-data.store';
import {AppServiceStub} from '../../../../shared/angular-commons/testing/appservice-stubs';
import {SDocSearchFormConverter} from '../../services/sdoc-searchform-converter.service';
import {ToastModule, ToastsManager} from 'ng2-toastr';
import {CommonDocRoutingService} from '../../../../shared/frontend-cdoc-commons/services/cdoc-routing.service';
import {TranslateModule} from '@ngx-translate/core';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {ActivatedRouteStub} from '../../../../shared/testing/router-stubs';
import {SDocDataServiceStub} from '../../../../testing/sdoc-dataservice-stubs';
import {SearchParameterUtils} from '../../../../shared/search-commons/services/searchparameter.utils';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {RouterStub} from '../../../../shared/angular-commons/testing/router-stubs';
import {PageUtils} from '../../../../shared/angular-commons/services/page.utils';
import {SearchFormUtils} from '../../../../shared/angular-commons/services/searchform-utils.service';
import {SDocRoutingService} from '../../../../shared/sdoc-commons/services/sdoc-routing.service';

describe('SDocInlineSearchpageComponent', () => {
    let component: SDocInlineSearchpageComponent;
    let fixture: ComponentFixture<SDocInlineSearchpageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocInlineSearchpageComponent],
            imports: [ToastModule.forRoot(),
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: SDocDataStore, useValue: new SDocDataStore(new SearchParameterUtils(), new SDocTeamFilterConfig()) },
                { provide: GenericAppService, useValue: new AppServiceStub() },
                { provide: SDocDataService, useValue: new SDocDataServiceStub() },
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: Router, useValue: new RouterStub() },
                CommonRoutingService,
                SearchFormUtils,
                SDocSearchFormConverter,
                { provide: SearchParameterUtils, useValue: new SearchParameterUtils() },
                CommonDocRoutingService,
                SDocRoutingService,
                ToastsManager,
                PageUtils
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocInlineSearchpageComponent);
        component = fixture.componentInstance;
        component.params = {};
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
