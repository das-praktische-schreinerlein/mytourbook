/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TourDocListItemFlatComponent} from './tdoc-list-item-flat.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {CommonDocRoutingService} from '../../../../shared/frontend-cdoc-commons/services/cdoc-routing.service';
import {TranslateModule} from '@ngx-translate/core';
import {CommonDocContentUtils} from '../../../../shared/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {AppServiceStub} from '../../../../shared/angular-commons/testing/appservice-stubs';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {RouterStub} from '../../../../shared/angular-commons/testing/router-stubs';
import {DatePipe} from '@angular/common';
import {TourDocDateFormatPipe} from '../../pipes/tdoc-dateformat.pipe';
import {LayoutService} from '../../../../shared/angular-commons/services/layout.service';
import {CommonDocDataServiceStub} from '../../../../shared/testing/cdoc-dataservice-stubs';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';

describe('TourDocListItemFlatComponent', () => {
    let component: TourDocListItemFlatComponent;
    let fixture: ComponentFixture<TourDocListItemFlatComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TourDocListItemFlatComponent, TourDocDateFormatPipe],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                CommonRoutingService,
                CommonDocRoutingService,
                CommonDocContentUtils,
                TourDocContentUtils,
                DatePipe,
                { provide: GenericAppService, useValue: new AppServiceStub() },
                LayoutService
            ],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [NgbModule.forRoot(),
                TranslateModule.forRoot()]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TourDocListItemFlatComponent);
        component = fixture.componentInstance;
        component.record = CommonDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
