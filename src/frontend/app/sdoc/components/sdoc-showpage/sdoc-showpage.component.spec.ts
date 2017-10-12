/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SDocShowpageComponent} from './sdoc-showpage.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastModule, ToastsManager} from 'ng2-toastr';
import {SDocRoutingService} from '../../../shared-sdoc/services/sdoc-routing.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ActivatedRouteStub} from '../../../../testing/router-stubs';
import {SDocContentUtils} from '../../../shared-sdoc/services/sdoc-contentutils.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppServiceStub} from '../../../../shared/angular-commons/testing/appservice-stubs';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {ErrorResolver} from '../../../sections/resolver/error.resolver';
import {PageUtils} from '../../../../shared/angular-commons/services/page.utils';
import {AngularMarkdownService} from '../../../../shared/angular-commons/services/angular-markdown.service';
import {MarkdownModule, MarkdownService} from 'angular2-markdown';
import {AngularHtmlService} from '../../../../shared/angular-commons/services/angular-html.service';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {RouterStub} from '../../../../shared/angular-commons/testing/router-stubs';

describe('SDocShowpageComponent', () => {
    let component: SDocShowpageComponent;
    let fixture: ComponentFixture<SDocShowpageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocShowpageComponent],
            imports: [
                NgbModule.forRoot(),
                ToastModule.forRoot(),
                TranslateModule.forRoot(),
                MarkdownModule.forRoot()],
            providers: [
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: Router, useValue: new RouterStub() },
                CommonRoutingService,
                SDocContentUtils,
                { provide: GenericAppService, useValue: new AppServiceStub() },
                SDocRoutingService,
                ToastsManager,
                TranslateService,
                MarkdownService,
                AngularMarkdownService,
                AngularHtmlService,
                ErrorResolver,
                PageUtils
        ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocShowpageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
