/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {SDocListHeaderComponent} from './sdoc-list-header.component';
import {SDocDataServiceStub} from '../../../../testing/sdoc-dataservice-stubs';

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
        component.searchResult = SDocDataServiceStub.defaultSearchResult();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
