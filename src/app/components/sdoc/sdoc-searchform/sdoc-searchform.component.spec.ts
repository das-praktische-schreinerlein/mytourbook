/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SDocSearchformComponent} from './sdoc-searchform.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {SDocSearchForm} from '../../../model/forms/sdoc-searchform';
import {SDocSearchResult} from '../../../model/container/sdoc-searchresult';
import {SDocRecord} from '../../../model/records/sdoc-record';
import {Facets} from '../../../model/container/facets';

describe('SDocSearchformComponent', () => {
    let component: SDocSearchformComponent;
    let fixture: ComponentFixture<SDocSearchformComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocSearchformComponent],
            imports: [ReactiveFormsModule],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocSearchformComponent);
        component = fixture.componentInstance;
        component.searchResult = new SDocSearchResult(
            new SDocSearchForm({ fulltext: 'Test'}), 1, [ new SDocRecord({id: '1', name: 'Test'})], new Facets());
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
