/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonDocRoutingService} from '@dps/mycms-frontend-commons/dist/frontend-cdoc-commons/services/cdoc-routing.service';
import {TranslateModule} from '@ngx-translate/core';
import {ActivatedRouteStub} from '@dps/mycms-frontend-commons/dist/testing/router-stubs';
import {CommonRoutingService} from '@dps/mycms-frontend-commons/dist/angular-commons/services/common-routing.service';
import {RouterStub} from '@dps/mycms-frontend-commons/dist/angular-commons/testing/router-stubs';
import {TourDocRoutingService} from '../../../../shared/tdoc-commons/services/tdoc-routing.service';
import {TourDocSimpleSearchNavigationComponent} from './tdoc-simple-search-navigation.component';

describe('TourDocSimpleSearchNavigationComponent', () => {
    let component: TourDocSimpleSearchNavigationComponent;
    let fixture: ComponentFixture<TourDocSimpleSearchNavigationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TourDocSimpleSearchNavigationComponent],
            imports: [
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
                { provide: Router, useValue: new RouterStub() },
                CommonRoutingService,
                CommonDocRoutingService,
                TourDocRoutingService
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TourDocSimpleSearchNavigationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
