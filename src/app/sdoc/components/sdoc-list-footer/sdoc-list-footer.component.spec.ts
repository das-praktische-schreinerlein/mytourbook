/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocListFooterComponent} from './sdoc-list-footer.component';
import {SDocRecord} from '../../../sdocshared/model/records/sdoc-record';
import {SDocSearchForm} from '../../../sdocshared/model/forms/sdoc-searchform';
import {SDocSearchResult} from '../../../sdocshared/model/container/sdoc-searchresult';
import {Facets} from '../../../../commons/model/container/facets';

describe('SDocListFooterComponent', () => {
    let component: SDocListFooterComponent;
    let fixture: ComponentFixture<SDocListFooterComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocListFooterComponent],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocListFooterComponent);
        component = fixture.componentInstance;
        component.searchResult = new SDocSearchResult(
            new SDocSearchForm({}), 1, [ new SDocRecord({id: '1', name: 'Test'})], new Facets());
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
