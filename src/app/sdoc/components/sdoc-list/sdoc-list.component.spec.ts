/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocListComponent} from './sdoc-list.component';
import {SDocSearchFormConverter} from '../../services/sdoc-searchform-converter.service';
import {SearchFormUtils} from '../../../../commons/services/searchform-utils.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {SDocDataServiceStub} from '../../../../testing/sdoc-dataservice-stubs';

describe('SDocListComponent', () => {
    let component: SDocListComponent;
    let fixture: ComponentFixture<SDocListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocListComponent],
            imports: [
                TranslateModule.forRoot()
            ],
            providers: [
                SDocSearchFormConverter,
                SearchFormUtils,
                TranslateService
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocListComponent);
        component = fixture.componentInstance;
        component.searchResult = SDocDataServiceStub.defaultSearchResult();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
