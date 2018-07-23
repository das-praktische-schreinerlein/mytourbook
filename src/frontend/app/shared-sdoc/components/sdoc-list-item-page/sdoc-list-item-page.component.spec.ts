/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocListItemPageComponent} from './sdoc-list-item-page.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {CommonDocRoutingService} from '../../../../shared/frontend-cdoc-commons/services/cdoc-routing.service';
import {TranslateModule} from '@ngx-translate/core';
import {SDocDataServiceStub} from '../../../../testing/sdoc-dataservice-stubs';
import {AngularCommonsModule} from '../../../../shared/angular-commons/angular-commons.module';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {AppServiceStub} from '../../../../shared/angular-commons/testing/appservice-stubs';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {RouterStub} from '../../../../shared/angular-commons/testing/router-stubs';
import {SDocDateFormatPipe} from '../../pipes/sdoc-dateformat.pipe';
import {DatePipe} from '@angular/common';
import {AngularHtmlService} from '../../../../shared/angular-commons/services/angular-html.service';
import {MarkdownService} from 'angular2-markdown';
import {AngularMarkdownService} from '../../../../shared/angular-commons/services/angular-markdown.service';
import {PlatformService} from '../../../../shared/angular-commons/services/platform.service';
import {HttpModule} from '@angular/http';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';
import {SDocSearchFormConverter} from '../../services/sdoc-searchform-converter.service';
import {SearchParameterUtils} from '../../../../shared/search-commons/services/searchparameter.utils';
import {SDocContentUtils} from '../../services/sdoc-contentutils.service';

describe('SDocListItemPageComponent', () => {
    let component: SDocListItemPageComponent;
    let fixture: ComponentFixture<SDocListItemPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocListItemPageComponent, SDocDateFormatPipe],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                PlatformService,
                { provide: SDocDataService, useValue: new SDocDataServiceStub() },
                SearchParameterUtils,
                SDocSearchFormConverter,
                CommonRoutingService,
                CommonDocRoutingService,
                SDocContentUtils,
                MarkdownService,
                AngularMarkdownService,
                AngularHtmlService,
                DatePipe,
                { provide: GenericAppService, useValue: new AppServiceStub() }
            ],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [NgbModule.forRoot(),
                TranslateModule.forRoot(),
                AngularCommonsModule,
                HttpModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocListItemPageComponent);
        component = fixture.componentInstance;
        component.record = SDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
