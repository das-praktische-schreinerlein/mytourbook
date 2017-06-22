/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocRecord} from '../../../model/records/sdoc-record';
import {SDocSearchForm} from '../../../model/forms/sdoc-searchform';
import {SDocSearchResult} from '../../../model/container/sdoc-searchresult';
import {SDocListHeaderComponent} from './sdoc-list-header.component';
import {Facets} from '../../../../commons/model/container/facets';

describe('SDocListHeaderComponent', () => {
    let component: SDocListHeaderComponent;
    let fixture: ComponentFixture<SDocListHeaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocListHeaderComponent],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocListHeaderComponent);
        component = fixture.componentInstance;
        component.searchResult = new SDocSearchResult(
            new SDocSearchForm({}), 1, [ new SDocRecord({id: '1', name: 'Test'})], new Facets());
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
