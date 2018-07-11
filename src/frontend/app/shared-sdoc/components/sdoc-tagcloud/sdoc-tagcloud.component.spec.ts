/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocTagcloudComponent} from './sdoc-tagcloud.component';
import {SearchParameterUtils} from '../../../../shared/search-commons/services/searchparameter.utils';
import {SearchFormUtils} from '../../../../shared/angular-commons/services/searchform-utils.service';
import {TranslateModule} from '@ngx-translate/core';
import {CommonDocDataServiceStub} from '../../../../testing/cdoc-dataservice-stubs';

describe('SDocTagcloudComponent', () => {
    let component: SDocTagcloudComponent;
    let fixture: ComponentFixture<SDocTagcloudComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocTagcloudComponent],
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
        fixture = TestBed.createComponent(SDocTagcloudComponent);
        component = fixture.componentInstance;
        component.searchResult = CommonDocDataServiceStub.defaultSearchResult();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
