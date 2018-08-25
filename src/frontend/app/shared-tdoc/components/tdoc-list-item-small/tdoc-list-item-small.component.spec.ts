/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TourDocListItemSmallComponent} from './tdoc-list-item-small.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {CommonDocRoutingService} from '../../../../shared/frontend-cdoc-commons/services/cdoc-routing.service';
import {TranslateModule} from '@ngx-translate/core';
import {CommonDocContentUtils} from '../../../../shared/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {AppServiceStub} from '../../../../shared/angular-commons/testing/appservice-stubs';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {RouterStub} from '../../../../shared/angular-commons/testing/router-stubs';
import {TourDocDateFormatPipe} from '../../pipes/tdoc-dateformat.pipe';
import {DatePipe} from '@angular/common';
import {CommonDocDataServiceStub} from '../../../../shared/testing/cdoc-dataservice-stubs';
import {LayoutService} from '../../../../shared/angular-commons/services/layout.service';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';

describe('TourDocListItemSmallComponent', () => {
    let component: TourDocListItemSmallComponent;
    let fixture: ComponentFixture<TourDocListItemSmallComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TourDocListItemSmallComponent, TourDocDateFormatPipe],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                CommonRoutingService,
                CommonDocRoutingService,
                CommonDocContentUtils,
                TourDocContentUtils,
                DatePipe,
                LayoutService,
                { provide: GenericAppService, useValue: new AppServiceStub() }
            ],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [NgbModule.forRoot(),
                TranslateModule.forRoot()]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TourDocListItemSmallComponent);
        component = fixture.componentInstance;
        component.record = CommonDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
