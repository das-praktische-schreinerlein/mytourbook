/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TourDocEditpageComponent} from './tdoc-editpage.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastModule, ToastsManager} from 'ng2-toastr';
import {CommonDocRoutingService} from '../../../../shared/frontend-cdoc-commons/services/cdoc-routing.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ActivatedRouteStub} from '../../../../shared/testing/router-stubs';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppServiceStub} from '../../../../shared/angular-commons/testing/appservice-stubs';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {ErrorResolver} from '../../../../shared/frontend-cdoc-commons/resolver/error.resolver';
import {PageUtils} from '../../../../shared/angular-commons/services/page.utils';
import {AngularMarkdownService} from '../../../../shared/angular-commons/services/angular-markdown.service';
import {MarkdownModule, MarkdownService} from 'angular2-markdown';
import {AngularHtmlService} from '../../../../shared/angular-commons/services/angular-html.service';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {RouterStub} from '../../../../shared/angular-commons/testing/router-stubs';
import {Angulartics2} from 'angulartics2';
import {GenericTrackingService} from '../../../../shared/angular-commons/services/generic-tracking.service';
import {Angulartics2Stub} from '../../../../shared/angular-commons/testing/angulartics2-stubs';
import {TourDocDateFormatPipe} from '../../../shared-tdoc/pipes/tdoc-dateformat.pipe';
import {DatePipe} from '@angular/common';
import {PlatformService} from '../../../../shared/angular-commons/services/platform.service';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocDataServiceStub} from '../../../../testing/tdoc-dataservice-stubs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {TourDocContentUtils} from '../../../shared-tdoc/services/tdoc-contentutils.service';
import {TourDocRoutingService} from '../../../../shared/tdoc-commons/services/tdoc-routing.service';
import {LayoutService} from '../../../../shared/angular-commons/services/layout.service';

describe('TourDocEditpageComponent', () => {
    let component: TourDocEditpageComponent;
    let fixture: ComponentFixture<TourDocEditpageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TourDocEditpageComponent, TourDocDateFormatPipe],
            imports: [
                NgbModule.forRoot(),
                ToastModule.forRoot(),
                TranslateModule.forRoot(),
                MarkdownModule.forRoot(),
                NoopAnimationsModule
            ],
            providers: [
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: Router, useValue: new RouterStub() },
                DatePipe,
                CommonRoutingService,
                PlatformService,
                TourDocContentUtils,
                { provide: GenericAppService, useValue: new AppServiceStub() },
                CommonDocRoutingService,
                TourDocRoutingService,
                ToastsManager,
                TranslateService,
                MarkdownService,
                AngularMarkdownService,
                AngularHtmlService,
                ErrorResolver,
                PageUtils,
                GenericTrackingService,
                { provide: Angulartics2, useValue: new Angulartics2Stub() },
                { provide: TourDocDataService, useValue: new TourDocDataServiceStub() },
                LayoutService
        ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TourDocEditpageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
