/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TourDocSearchformComponent} from './tdoc-searchform.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {TourDocSearchFormUtils} from '../../services/tdoc-searchform-utils.service';
import {SearchFormUtils} from '@dps/mycms-frontend-commons/dist/angular-commons/services/searchform-utils.service';
import {TourDocDataServiceStub} from '../../../../testing/tdoc-dataservice-stubs';
import {SearchParameterUtils} from '@dps/mycms-commons/dist/search-commons/services/searchparameter.utils';
import {TourDocSearchFormConverter} from '../../services/tdoc-searchform-converter.service';
import {TourDocDataStore, TourDocTeamFilterConfig} from '../../../../shared/tdoc-commons/services/tdoc-data.store';
import {ToastrService} from 'ngx-toastr';
import {TourDocDataCacheService} from '../../services/tdoc-datacache.service';
import {TourDocDataService} from '../../../../shared/tdoc-commons/services/tdoc-data.service';
import {ToastrServiceStub} from '@dps/mycms-frontend-commons/dist/testing/toasts-stubs';

describe('TourDocSearchformComponent', () => {
    let component: TourDocSearchformComponent;
    let fixture: ComponentFixture<TourDocSearchformComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TourDocSearchformComponent],
            imports: [
                ReactiveFormsModule,
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: TourDocDataStore, useValue: new TourDocDataStore(new SearchParameterUtils(), new TourDocTeamFilterConfig()) },
                { provide: TourDocDataService, useValue: new TourDocDataServiceStub() },
                TourDocDataCacheService,
                TourDocSearchFormUtils,
                TourDocSearchFormConverter,
                SearchFormUtils,
                { provide: SearchParameterUtils, useValue: new SearchParameterUtils() },
                { provide: ToastrService, useValue: new ToastrServiceStub() }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TourDocSearchformComponent);
        component = fixture.componentInstance;
        component.searchResult = TourDocDataServiceStub.defaultSearchResult();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
