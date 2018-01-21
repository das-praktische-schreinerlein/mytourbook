/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SDocSearchformComponent} from './sdoc-searchform.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {SDocSearchFormUtils} from '../../services/sdoc-searchform-utils.service';
import {SearchFormUtils} from '../../../../shared/angular-commons/services/searchform-utils.service';
import {SDocDataServiceStub} from '../../../../testing/sdoc-dataservice-stubs';
import {SearchParameterUtils} from '../../../../shared/search-commons/services/searchparameter.utils';
import {SDocSearchFormConverter} from '../../services/sdoc-searchform-converter.service';
import {SDocDataStore, SDocTeamFilterConfig} from '../../../../shared/sdoc-commons/services/sdoc-data.store';
import {ToastModule, ToastsManager} from 'ng2-toastr';
import {SDocDataCacheService} from '../../services/sdoc-datacache.service';
import {SDocDataService} from '../../../../shared/sdoc-commons/services/sdoc-data.service';

describe('SDocSearchformComponent', () => {
    let component: SDocSearchformComponent;
    let fixture: ComponentFixture<SDocSearchformComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocSearchformComponent],
            imports: [
                ReactiveFormsModule,
                ToastModule.forRoot(),
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: SDocDataStore, useValue: new SDocDataStore(new SearchParameterUtils(), new SDocTeamFilterConfig()) },
                { provide: SDocDataService, useValue: new SDocDataServiceStub() },
                SDocDataCacheService,
                SDocSearchFormUtils,
                SDocSearchFormConverter,
                SearchFormUtils,
                { provide: SearchParameterUtils, useValue: new SearchParameterUtils() },
                ToastsManager
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocSearchformComponent);
        component = fixture.componentInstance;
        component.searchResult = SDocDataServiceStub.defaultSearchResult();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
