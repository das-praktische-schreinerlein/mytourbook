/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SectionPageComponent} from './section-page.component';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivatedRouteStub} from '../../../testing/router-stubs';
import {ToastModule, ToastsManager} from 'ng2-toastr';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {SearchParameterUtils} from '../../../search-commons/services/searchparameter.utils';
import {PDocDataServiceStub} from '../../../testing/pdoc-dataservice-stubs';
import {PDocDataService} from '../../../pdoc-commons/services/pdoc-data.service';
import {CommonDocRoutingService} from '../../../frontend-cdoc-commons/services/cdoc-routing.service';
import {ErrorResolver} from '../../../frontend-cdoc-commons/resolver/error.resolver';
import {PageUtils} from '../../../angular-commons/services/page.utils';
import {AngularMarkdownService} from '../../../angular-commons/services/angular-markdown.service';
import {MarkdownModule, MarkdownService} from 'angular2-markdown';
import {AngularHtmlService} from '../../../angular-commons/services/angular-html.service';
import {CommonRoutingService} from '../../../angular-commons/services/common-routing.service';
import {RouterStub} from '../../../angular-commons/testing/router-stubs';
import {Angulartics2} from 'angulartics2';
import {GenericTrackingService} from '../../../angular-commons/services/generic-tracking.service';
import {Angulartics2Stub} from '../../../angular-commons/testing/angulartics2-stubs';
import {PlatformService} from '../../../angular-commons/services/platform.service';
import {LayoutService} from '../../../angular-commons/services/layout.service';
import {AppServiceStub} from '../../../angular-commons/testing/appservice-stubs';
import {GenericAppService} from '../../../commons/services/generic-app.service';

describe('SectionPageComponent', () => {
    let component: SectionPageComponent;
    let fixture: ComponentFixture<SectionPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SectionPageComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                ToastModule.forRoot(),
                TranslateModule.forRoot(),
                MarkdownModule.forRoot()],
            providers: [
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: Router, useValue: new RouterStub() },
                { provide: PDocDataService, useValue: new PDocDataServiceStub() },
                { provide: GenericAppService, useValue: new AppServiceStub() },
                CommonRoutingService,
                PlatformService,
                CommonDocRoutingService,
                SearchParameterUtils,
                ToastsManager,
                TranslateService,
                MarkdownService,
                AngularMarkdownService,
                AngularHtmlService,
                ErrorResolver,
                PageUtils,
                GenericTrackingService,
                { provide: Angulartics2, useValue: new Angulartics2Stub() },
                LayoutService
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SectionPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
