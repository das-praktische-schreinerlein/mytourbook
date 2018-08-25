/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TourDocListItemPageComponent} from './tdoc-list-item-page.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {CommonDocRoutingService} from '../../../../shared/frontend-cdoc-commons/services/cdoc-routing.service';
import {TranslateModule} from '@ngx-translate/core';
import {TourDocDataServiceStub} from '../../../../testing/tdoc-dataservice-stubs';
import {AngularCommonsModule} from '../../../../shared/angular-commons/angular-commons.module';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {AppServiceStub} from '../../../../shared/angular-commons/testing/appservice-stubs';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {RouterStub} from '../../../../shared/angular-commons/testing/router-stubs';
import {TourDocDateFormatPipe} from '../../pipes/tdoc-dateformat.pipe';
import {DatePipe} from '@angular/common';
import {AngularHtmlService} from '../../../../shared/angular-commons/services/angular-html.service';
import {MarkdownService} from 'angular2-markdown';
import {AngularMarkdownService} from '../../../../shared/angular-commons/services/angular-markdown.service';
import {PlatformService} from '../../../../shared/angular-commons/services/platform.service';
import {HttpModule} from '@angular/http';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {TourDocSearchFormConverter} from '../../services/tdoc-searchform-converter.service';
import {SearchParameterUtils} from '../../../../shared/search-commons/services/searchparameter.utils';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';
import {SearchFormUtils} from '../../../../shared/angular-commons/services/searchform-utils.service';

describe('TourDocListItemPageComponent', () => {
    let component: TourDocListItemPageComponent;
    let fixture: ComponentFixture<TourDocListItemPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TourDocListItemPageComponent, TourDocDateFormatPipe],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                PlatformService,
                { provide: TourDocDataService, useValue: new TourDocDataServiceStub() },
                SearchParameterUtils,
                TourDocSearchFormConverter,
                CommonRoutingService,
                CommonDocRoutingService,
                SearchFormUtils,
                TourDocContentUtils,
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
        fixture = TestBed.createComponent(TourDocListItemPageComponent);
        component = fixture.componentInstance;
        component.record = TourDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
