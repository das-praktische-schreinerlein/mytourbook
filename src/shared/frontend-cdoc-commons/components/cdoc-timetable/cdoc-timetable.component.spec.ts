/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonDocTimetableComponent} from './cdoc-timetable.component';
import {SearchParameterUtils} from '../../../search-commons/services/searchparameter.utils';
import {SearchFormUtils} from '../../../angular-commons/services/searchform-utils.service';
import {TranslateModule} from '@ngx-translate/core';
import {CommonDocDataServiceStub} from '../../../testing/cdoc-dataservice-stubs';

describe('CommonDocTimetableComponent', () => {
    let component: CommonDocTimetableComponent;
    let fixture: ComponentFixture<CommonDocTimetableComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CommonDocTimetableComponent],
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
        fixture = TestBed.createComponent(CommonDocTimetableComponent);
        component = fixture.componentInstance;
        component.searchResult = CommonDocDataServiceStub.defaultSearchResult();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
