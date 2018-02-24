/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocTypetableComponent} from './sdoc-typetable.component';
import {SDocDataServiceStub} from '../../../../testing/sdoc-dataservice-stubs';
import {TranslateModule} from '@ngx-translate/core';
import {SDocSearchFormUtils} from '../../services/sdoc-searchform-utils.service';
import {SearchParameterUtils} from '../../../../shared/search-commons/services/searchparameter.utils';
import {SearchFormUtils} from '../../../../shared/angular-commons/services/searchform-utils.service';

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
                SDocSearchFormUtils
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocTypetableComponent);
        component = fixture.componentInstance;
        component.searchResult = SDocDataServiceStub.defaultSearchResult();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
