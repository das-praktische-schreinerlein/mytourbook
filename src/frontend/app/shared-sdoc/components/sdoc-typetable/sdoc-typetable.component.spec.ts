/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocTypetableComponent} from './sdoc-typetable.component';
import {TranslateModule} from '@ngx-translate/core';
import {SearchParameterUtils} from '../../../../shared/search-commons/services/searchparameter.utils';
import {SearchFormUtils} from '../../../../shared/angular-commons/services/searchform-utils.service';
import {CommonDocSearchFormUtils} from '../../services/cdoc-searchform-utils.service';
import {CommonDocDataServiceStub} from '../../../../testing/cdoc-dataservice-stubs';

describe('SDocTypetableComponent', () => {
    let component: SDocTypetableComponent;
    let fixture: ComponentFixture<SDocTypetableComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocTypetableComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                TranslateModule.forRoot()
            ],
            providers: [
                SearchParameterUtils,
                SearchFormUtils,
                CommonDocSearchFormUtils
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocTypetableComponent);
        component = fixture.componentInstance;
        component.searchResult = CommonDocDataServiceStub.defaultSearchResult();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
