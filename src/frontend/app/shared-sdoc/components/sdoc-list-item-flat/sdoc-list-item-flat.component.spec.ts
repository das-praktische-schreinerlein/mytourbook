/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocListItemFlatComponent} from './sdoc-list-item-flat.component';
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
import {SDocDateFormatPipe} from '../../pipes/sdoc-dateformat.pipe';
import {LayoutService} from '../../../../shared/angular-commons/services/layout.service';
import {CommonDocDataServiceStub} from '../../../../shared/testing/cdoc-dataservice-stubs';
import {SDocContentUtils} from '../../services/sdoc-contentutils.service';

describe('SDocListItemFlatComponent', () => {
    let component: SDocListItemFlatComponent;
    let fixture: ComponentFixture<SDocListItemFlatComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocListItemFlatComponent, SDocDateFormatPipe],
            providers: [
                { provide: Router, useValue: new RouterStub() },
                CommonRoutingService,
                CommonDocRoutingService,
                CommonDocContentUtils,
                SDocContentUtils,
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
        fixture = TestBed.createComponent(SDocListItemFlatComponent);
        component = fixture.componentInstance;
        component.record = CommonDocDataServiceStub.defaultRecord();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
