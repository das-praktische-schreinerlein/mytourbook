/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {TourDocListComponent} from './tdoc-list.component';
import {TourDocSearchFormConverter} from '../../services/tdoc-searchform-converter.service';
import {TranslateModule} from '@ngx-translate/core';
import {TourDocDataServiceStub} from '../../../../testing/tdoc-dataservice-stubs';
import {SearchParameterUtils} from '../../../../shared/search-commons/services/searchparameter.utils';
import {CommonDocContentUtils} from '../../../../shared/frontend-cdoc-commons/services/cdoc-contentutils.service';
import {AppServiceStub} from '../../../../shared/angular-commons/testing/appservice-stubs';
import {GenericAppService} from '../../../../shared/commons/services/generic-app.service';
import {Lightbox, LightboxConfig, LightboxEvent} from 'angular2-lightbox';
import {TourDocLightBoxService} from '../../services/tdoc-lightbox.service';
import {CommonDocRoutingService} from '../../../../shared/frontend-cdoc-commons/services/cdoc-routing.service';
import {CommonRoutingService} from '../../../../shared/angular-commons/services/common-routing.service';
import {Router} from '@angular/router';
import {RouterStub} from '../../../../shared/angular-commons/testing/router-stubs';
import {SearchFormUtils} from '../../../../shared/angular-commons/services/searchform-utils.service';
import {TourDocContentUtils} from '../../services/tdoc-contentutils.service';

describe('TourDocListComponent', () => {
    let component: TourDocListComponent;
    let fixture: ComponentFixture<TourDocListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TourDocListComponent],
            imports: [
                TranslateModule.forRoot()
            ],
            providers: [
                TourDocSearchFormConverter,
                { provide: Router, useValue: new RouterStub() },
                CommonRoutingService,
                CommonDocRoutingService,
                CommonDocContentUtils,
                TourDocContentUtils,
                LightboxEvent,
                LightboxConfig,
                Lightbox,
                TourDocLightBoxService,
                SearchFormUtils,
                { provide: GenericAppService, useValue: new AppServiceStub() },
                { provide: SearchParameterUtils, useValue: new SearchParameterUtils() }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TourDocListComponent);
        component = fixture.componentInstance;
        component.searchResult = TourDocDataServiceStub.defaultSearchResult();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
