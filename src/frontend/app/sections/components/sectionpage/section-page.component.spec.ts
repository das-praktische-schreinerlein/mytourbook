/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SectionPageComponent} from './section-page.component';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivatedRouteStub} from '../../../../testing/router-stubs';
import {ToastModule, ToastsManager} from 'ng2-toastr';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {SDocSearchFormConverter} from '../../../shared-sdoc/services/sdoc-searchform-converter.service';
import {SearchParameterUtils} from '../../../../shared/search-commons/services/searchparameter.utils';
import {PDocDataServiceStub} from '../../../../testing/pdoc-dataservice-stubs';
import {PDocDataService} from '../../../../shared/pdoc-commons/services/pdoc-data.service';
import {SDocRoutingService} from '../../../shared-sdoc/services/sdoc-routing.service';
import {ErrorResolver} from '../../resolver/error.resolver';
import {PageUtils} from '../../../../shared/angular-commons/services/page.utils';
import {AngularMarkdownService} from '../../../../shared/angular-commons/services/angular-markdown.service';
import {MarkdownModule, MarkdownService} from 'angular2-markdown';
import {AngularHtmlService} from '../../../../shared/angular-commons/services/angular-html.service';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {RouterStub} from '../../../../shared/angular-commons/testing/router-stubs';
import {Angulartics2} from 'angulartics2';
import {GenericTrackingService} from '../../../../shared/angular-commons/services/generic-tracking.service';
import {Angulartics2Stub} from '../../../../shared/angular-commons/testing/angulartics2-stubs';
import {PlatformService} from '../../../../shared/angular-commons/services/platform.service';
import {LayoutService} from '../../../../shared/angular-commons/services/layout.service';

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
                CommonRoutingService,
                PlatformService,
                SDocSearchFormConverter,
                SDocRoutingService,
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
