/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocListComponent} from './sdoc-list.component';
import {SDocRecord} from '../../../model/records/sdoc-record';
import {SDocSearchResult} from '../../../model/container/sdoc-searchresult';
import {SDocSearchForm} from '../../../model/forms/sdoc-searchform';

describe('SDocListComponent', () => {
    let component: SDocListComponent;
    let fixture: ComponentFixture<SDocListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SDocListComponent],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SDocListComponent);
        component = fixture.componentInstance;
        component.searchResult = new SDocSearchResult(
            new SDocSearchForm({}), 1, [ new SDocRecord({id: '1', name: 'Test'})]);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
