/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocTimetableComponent} from './sdoc-timetable.component';
import {SDocDataServiceStub} from '../../../../testing/sdoc-dataservice-stubs';
import {SearchParameterUtils} from '../../../../shared/search-commons/services/searchparameter.utils';
import {SearchFormUtils} from '../../../../shared/angular-commons/services/searchform-utils.service';
import {TranslateModule} from '@ngx-translate/core';

describe('SDocTimetableComponent', () => {
    let component: SDocTimetableComponent;
    let fixture: ComponentFixture<SDocTimetableComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocTimetableComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                TranslateModule.forRoot()
            ],
            providers: [
                SearchParameterUtils,
                SearchFormUtils
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocTimetableComponent);
        component = fixture.componentInstance;
        component.searchResult = SDocDataServiceStub.defaultSearchResult();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
